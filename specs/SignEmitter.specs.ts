import { assert } from 'chai';
import { SinonSpy, spy } from 'sinon';
import SignEmitter from '../src/hot-reload/SignEmitter';
import * as blockProtection from '../src/utils/block-protection';
import * as logger from '../src/utils/logger';

import {
  FAST_RELOAD_CALLS,
  FAST_RELOAD_DEBOUNCING_FRAME,
  FAST_RELOAD_WAIT,
  NEW_FAST_RELOAD_CALLS,
  NEW_FAST_RELOAD_CHROME_VERSION,
  NEW_FAST_RELOAD_DEBOUNCING_FRAME,
} from '../src/constants/fast-reloading.constants';

describe('SignEmitter', () => {
  let mockedServer: any;
  let mockedBrowserInfo: { name: string; version: string; };
  let debounceSpy: SinonSpy;
  let warnSpy: SinonSpy;
  let fastReloadBlockerSpy: SinonSpy;

  beforeEach(() => {
    mockedServer = {
      clients: [],
    };
    mockedBrowserInfo = { name: 'Chrome', version: '0.0.0' };
    debounceSpy = spy(blockProtection, 'debounceSignal');
    warnSpy = spy(logger, 'warn');
    fastReloadBlockerSpy = spy(blockProtection, 'fastReloadBlocker');
  });
  afterEach(() => {
    debounceSpy.restore();
    fastReloadBlockerSpy.restore();
    warnSpy.restore();
  });

  it('Should setup signal debounce as fast reload blocker to avoid extension blocking', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const emitter = new SignEmitter(mockedServer, mockedBrowserInfo);

    assert(debounceSpy.calledWith(FAST_RELOAD_DEBOUNCING_FRAME));
    assert(fastReloadBlockerSpy.calledWith(FAST_RELOAD_CALLS, FAST_RELOAD_WAIT));
  });

  it(`Should assign new rules if the Chrome/Chromium version is >= ${NEW_FAST_RELOAD_CHROME_VERSION}`, () => {
    const [major, minor, patch] = NEW_FAST_RELOAD_CHROME_VERSION;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const emitter = new SignEmitter(mockedServer, {
      name: 'Chrome',
      version: `${major}.${minor}.${patch}`,
    });

    assert(debounceSpy.calledWith(NEW_FAST_RELOAD_DEBOUNCING_FRAME));
    assert(fastReloadBlockerSpy.calledWith(NEW_FAST_RELOAD_CALLS, FAST_RELOAD_WAIT));
  });
});