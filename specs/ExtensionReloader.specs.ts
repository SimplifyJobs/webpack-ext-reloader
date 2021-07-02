import { assert } from "chai";
import { SinonStub, spy, stub } from "sinon";
import * as webpack from "webpack";
import ExtensionReloaderImpl from "../src/ExtensionReloader";
import { IExtensionReloaderInstance } from "../typings/webpack-extension-reloader";

describe("ExtensionReloader", () => {
  const envCopy = { ...process.env };

  const registerStub = stub(
    ExtensionReloaderImpl.prototype,
    "_registerPlugin",
  ).returns();
  const versionCheckSpy = spy(ExtensionReloaderImpl.prototype._isWebpackGToEV4);

  function pluginFactory(
    version: string,
  ): [IExtensionReloaderInstance, SinonStub] {
    const webpackStub = stub(webpack, "version").value(version);
    const plugin = new ExtensionReloaderImpl();
    return [plugin, webpackStub];
  }

  beforeEach(() => {
    registerStub.reset();
    versionCheckSpy.resetHistory();
    process.env = { ...envCopy };
  });

  describe("When applying plugin, should check if is in development mode", () => {
    it("Should check for --mode flag on versions >= 4", () => {
      const [plugin, stubbed] = pluginFactory("4.2.21");
      const mockedCompiler = { options: { mode: "development" } } as webpack.Compiler;
      plugin.apply(mockedCompiler);
      assert(registerStub.called);

      stubbed.restore();
    });
  });
});
