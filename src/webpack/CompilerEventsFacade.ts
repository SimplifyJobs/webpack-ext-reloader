import { Compilation, Compiler } from 'webpack';

export default class CompilerEventsFacade {
  public static extensionName = 'webpack-ext-reloader';

  private _compiler: Compiler;

  constructor(compiler: Compiler) {
    this._compiler = compiler;
  }

  public beforeOptimizeChunks(call: (compilation: Compilation, chunks: Compilation['chunks']) => void) {
    return this._compiler.hooks.compilation.tap(CompilerEventsFacade.extensionName, (comp) => {
      const chunks = new Set();
      const beforeOptimizeChunkAssets = (chunksBeforeOptimization) => {
        call(comp, chunksBeforeOptimization);
      };
      comp.hooks.processAssets.tap(
        {
          name: CompilerEventsFacade.extensionName,
          stage: Compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS,
        },
        () => {
          comp.chunks.forEach((chunk) => {
            chunks.add(chunk);
          });
          beforeOptimizeChunkAssets(chunks);
        },
      );
    });
  }

  public afterEmit(call: (compilation: Compilation) => void) {
    return this._compiler.hooks.afterEmit.tap(CompilerEventsFacade.extensionName, call);
  }
}
