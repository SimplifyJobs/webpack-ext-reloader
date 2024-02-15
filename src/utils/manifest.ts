import { readFileSync } from "fs";
import * as JSON5 from "json5";
import { Compiler, Entry } from "webpack";
import { bgScriptEntryErrorMsg, bgScriptManifestRequiredMsg } from "../messages/errors";

export function extractEntries(
  webpackEntry: Entry,
  manifestPath: string,
  webpackOutput: Compiler["options"]["output"] = {},
): IEntriesOption {
  const manifestJson = JSON5.parse(readFileSync(manifestPath).toString()) as IExtensionManifest;
  const { background, content_scripts: contentScripts } = manifestJson;
  const { filename } = webpackOutput;

  if (!filename) {
    throw new Error("Please specify the `output.filename` in your webpack config.");
  }

  if (!(background?.scripts || background?.service_worker)) {
    throw new TypeError(bgScriptManifestRequiredMsg.get());
  }

  const getEntryFilename = (entryName: string) => {
    let entryFilename = filename;

    if (typeof entryFilename === "function") {
      entryFilename = entryFilename({
        hash: "[hash]",
        hashWithLength: (length: number) => `[hash:${length}]`,
        chunk: {
          id: "[id]",
          hash: "[chunkhash]",
          name: entryName,
        },
        basename: "[basename]",
        query: "[query]",
        contentHashType: "none",
        contentHash: "[contenthash]",
        contentHashWithLength: (length: number) => `[contenthash:${length}]`,
        noChunkHash: false,
        url: "[url]",
      });
    }

    entryFilename = entryFilename.replace("[name]", entryName);

    return entryFilename;
  };

  const bgScriptFilenames = background.service_worker ? [background.service_worker] : background.scripts ?? [];

  const bgWebpackEntry = Object.keys(webpackEntry).find((entryName) =>
    bgScriptFilenames.some((bgScriptFilename) => {
      const entryFilename = getEntryFilename(entryName);

      return bgScriptFilename === entryFilename;
    }),
  );

  if (!bgWebpackEntry) {
    throw new TypeError(bgScriptEntryErrorMsg.get());
  }

  const contentEntries = contentScripts
    ? Object.keys(webpackEntry).filter((entryName) =>
        contentScripts
          .flatMap(({ js }) => js)
          .filter(Boolean)
          .includes(getEntryFilename(entryName)),
      )
    : null;

  return {
    background: bgWebpackEntry,
    contentScript: contentEntries as string[],
    extensionPage: null,
  };
}
