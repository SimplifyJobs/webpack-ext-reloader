import { assert } from 'chai';
import { stub } from 'sinon';
import * as webpack from 'webpack';
import ExtensionReloaderImpl from '../src/ExtensionReloader';
import { IExtensionReloaderInstance } from '../typings/webpack-ext-reloader';

describe('ExtensionReloader', () => {
  const envCopy = { ...process.env };

  const registerStub = stub(ExtensionReloaderImpl.prototype, '_registerPlugin').returns();

  function pluginFactory(): IExtensionReloaderInstance {
    const plugin = new ExtensionReloaderImpl();
    return plugin;
  }

  beforeEach(() => {
    registerStub.reset();
    process.env = { ...envCopy };
  });

  describe('When applying plugin, should check if is in development mode', () => {
    it('Should check for --mode flag on versions >= 4', () => {
      const plugin = pluginFactory();
      const mockedCompiler = { options: {} } as webpack.Compiler;

      plugin.apply(mockedCompiler);
      assert(registerStub.notCalled);

      mockedCompiler.options.mode = 'development';
      plugin.apply(mockedCompiler);
      assert(registerStub.calledOnce);
    });
  });
});
