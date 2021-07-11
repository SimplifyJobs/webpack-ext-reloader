import { Compilation, Compiler } from "webpack";

export default class CompilerEventsFacade {
  public static extensionName = "webpack-extension-reloader";

  private _compiler: Compiler;

  constructor(compiler: Compiler) {
    this._compiler = compiler;
  }

  public afterOptimizeChunkAssets(
    call: (compilation: Compilation, chunks: Compilation["chunks"]) => void,
  ) {
    return this._compiler.hooks.compilation.tap(
      CompilerEventsFacade.extensionName,
      (comp) => {
        const afterOptimizeChunkAssets = (chunks) => {
          call(comp, chunks);
        };
        /* https://github.com/webpack/webpack/blob/main/lib/Compilation.js#L772-L779
        afterOptimizeChunkAssets = PROCESS_ASSETS_STAGE_OPTIMIZE + 1
        afterOptimizeChunkAssets = 101
        */
        const stage = 101;
        (comp.hooks as any).processAssets.tap(
          { name: CompilerEventsFacade.extensionName, stage },
          afterOptimizeChunkAssets,
        );
        comp.hooks.afterOptimizeChunkAssets.tap(
          CompilerEventsFacade.extensionName,
          (chunks) => call(comp, chunks),
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
