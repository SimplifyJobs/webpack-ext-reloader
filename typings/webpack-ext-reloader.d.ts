declare module 'webpack-ext-reloader' {
  import type { Compiler } from 'webpack';

  interface IEntriesOption {
    [key: string]: string | string[];
  }

  interface IPluginOptions {
    port: number;
    reloadPage: boolean;
    manifest?: string;
    entries?: IEntriesOption;
  }

  interface IExtensionReloaderInstance {
    apply(compiler: Compiler): void;
  }

  class ExtensionReloader implements IExtensionReloaderInstance {
    constructor(options?: IPluginOptions);

    apply(compiler: Compiler): void;
  }

  namespace ExtensionReloader {
    type PluginOptions = IPluginOptions;
    type EntriesOption = IEntriesOption;
    interface Instance extends IExtensionReloaderInstance {}
  }

  export = ExtensionReloader;
}
