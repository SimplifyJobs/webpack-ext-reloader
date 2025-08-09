import type { Compiler } from 'webpack';

export interface IEntriesOption {
  [key: string]: string | string[];
}

export interface IPluginOptions {
  port: number;
  reloadPage: boolean;
  manifest?: string;
  entries?: IEntriesOption;
}

export interface IExtensionReloaderInstance {
  apply(compiler: Compiler): void;
}

export default class ExtensionReloader implements IExtensionReloaderInstance {
  constructor(options?: IPluginOptions);
  apply(compiler: Compiler): void;
}

// Namespace 내용을 일반 export로 변환
export type PluginOptions = IPluginOptions;
export type EntriesOption = IEntriesOption;
export type Instance = IExtensionReloaderInstance;