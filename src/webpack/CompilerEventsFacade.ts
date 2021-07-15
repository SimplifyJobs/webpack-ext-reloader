import { Compilation, Compiler } from "webpack";

export default class CompilerEventsFacade {
  public static extensionName = "webpack-extension-reloader";

  private _compiler: Compiler;

  constructor(compiler: Compiler) {
    this._compiler = compiler;
  }

  public afterOptimizeChunks(
    call: (compilation: Compilation, chunks: Compilation["chunks"]) => void,
  ) {
    return this._compiler.hooks.compilation.tap(
      CompilerEventsFacade.extensionName,
      (comp) => {
        const afterOptimizeChunkAssets = (chunks) => {
          call(comp, chunks);
        };
        comp.hooks.processAssets.tap(
          {
            name: CompilerEventsFacade.extensionName,
            stage: Compilation.PROCESS_ASSETS_STAGE_ANALYSE,
          },
          afterOptimizeChunkAssets,
        );
      },
    );
  }

  public afterEmit(call: (compilation: Compilation) => void) {
    return this._compiler.hooks.afterEmit.tap(
      CompilerEventsFacade.extensionName,
      call,
    );
  }
}
