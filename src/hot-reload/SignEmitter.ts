import { zip } from 'lodash';
import { UAParser } from 'ua-parser-js';
import { OPEN, Server } from 'ws';

import {
  FAST_RELOAD_CALLS,
  FAST_RELOAD_DEBOUNCING_FRAME,
  FAST_RELOAD_WAIT,
  NEW_FAST_RELOAD_CALLS,
  NEW_FAST_RELOAD_CHROME_VERSION,
  NEW_FAST_RELOAD_DEBOUNCING_FRAME,
} from '../constants/fast-reloading.constants';
import { debounceSignal, fastReloadBlocker } from '../utils/block-protection';
import { signChange } from '../utils/signals';

interface MinimalBrowserInfo {
  name?: string;
  version?: string;
}

export default class SignEmitter {
  private _safeSignChange: (
    reloadPage: boolean,
    onlyPageChanged: boolean,
    onSuccess: (val?: any) => void,
    onError: (err: Error) => void,
  ) => void;

  private _server: Server;

  constructor(server: Server, { name, version }: MinimalBrowserInfo) {
    this._server = server;
    if (name === 'Chrome') {
      const [major, minor, patch] = (version || '').split('.').map(v => parseInt(v, 10));

      const [reloadCalls, reloadDeboucingFrame] = this._satisfies(
        [major, minor, patch],
        NEW_FAST_RELOAD_CHROME_VERSION,
      )
        ? [NEW_FAST_RELOAD_CALLS, NEW_FAST_RELOAD_DEBOUNCING_FRAME]
        : [FAST_RELOAD_CALLS, FAST_RELOAD_DEBOUNCING_FRAME];

      const debouncer = debounceSignal(reloadDeboucingFrame, this);
      const blocker = fastReloadBlocker(reloadCalls, FAST_RELOAD_WAIT, this);
      this._safeSignChange = debouncer(blocker(this._setupSafeSignChange()));
    } else {
      this._safeSignChange = this._setupSafeSignChange();
    }
  }

  public safeSignChange(reloadPage: boolean, onlyPageChanged: boolean): Promise<any> {
    return new Promise((res, rej) => {
      this._safeSignChange(reloadPage, onlyPageChanged, res, rej);
    });
  }

  private _setupSafeSignChange() {
    return (reloadPage: boolean, onlyPageChanged: boolean, onSuccess: () => void, onError: (err: Error) => void) => {
      try {
        this._sendMsg(signChange({ reloadPage, onlyPageChanged }));
        onSuccess();
      } catch (err) {
        onError(err);
      }
    };
  }

  private _sendMsg(msg: any) {
    this._server.clients.forEach((client) => {
      if (client.readyState === OPEN) {
        client.send(JSON.stringify(msg));
      }
    });
  }

  private _satisfies(browserVersion: BrowserVersion, targetVersion: BrowserVersion) {
    const versionPairs: VersionPair[] = zip(browserVersion, targetVersion);

    // eslint-disable-next-line no-restricted-syntax
    for (const [version = 0, target = 0] of versionPairs) {
      if (version !== target) {
        return version > target;
      }
    }
    return true;
  }
}
