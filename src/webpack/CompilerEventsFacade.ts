import { Compilation, Compiler } from "webpack";

export default class CompilerEventsFacade {
  public static extensionName = "webpack-extension-reloader";

  private _compiler: Compiler;

  constructor(compiler: Compiler) {
    this._compiler = compiler;
  }

  public afterOptimizeChunkAssets(
    call: (compilation: Compilation, assets: Compilation["assets"]) => void,
  ) {
    return this._compiler.hooks.compilation.tap(
      CompilerEventsFacade.extensionName,
      (comp) =>
        comp.hooks.processAssets.tap(
          {
            name: CompilerEventsFacade.extensionName,
            stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
          },
          (assets) => call(comp, assets),
        ),
    );
  }

  public afterEmit(call: (compilation: Compilation) => void) {
    return this._compiler.hooks.afterEmit.tap(
      CompilerEventsFacade.extensionName,
      call,
    );
  }
}
