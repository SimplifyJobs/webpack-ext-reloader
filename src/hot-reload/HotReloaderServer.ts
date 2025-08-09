import { UAParser } from 'ua-parser-js';
import { Server } from 'ws';
import { info } from '../utils/logger';
import SignEmitter from './SignEmitter';

export default class HotReloaderServer {
  private _server: Server;

  private _signEmitter: SignEmitter;

  constructor(port: number) {
    this._server = new Server({ port });
  }

  public listen() {
    this._server.on('connection', (ws, msg) => {
      const userAgent = new UAParser(msg.headers['user-agent']).getResult();
      this._signEmitter = new SignEmitter(this._server, userAgent.browser);

      ws.on('message', (data: string) => info(`Message from ${userAgent.browser.name}: ${JSON.parse(data).payload}`));
      ws.on('error', () => {
        // NOOP - swallow socket errors due to http://git.io/vbhSN
      });
    });
  }

  public signChange(reloadPage: boolean, onlyPageChanged: boolean): Promise<any> {
    if (this._signEmitter) {
      return this._signEmitter.safeSignChange(reloadPage, onlyPageChanged);
    }
    return Promise.resolve(null);
  }
}
