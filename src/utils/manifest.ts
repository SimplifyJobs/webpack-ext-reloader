import { readFileSync } from "fs";
import { flatMapDeep } from "lodash";
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

  const bgScriptFileNames = background.service_worker ? [background.service_worker] : background.scripts ?? [];
  const toRemove = (filename as string).replace("[name]", "");

  const bgWebpackEntry = Object.keys(webpackEntry).find((entryName) =>
    bgScriptFileNames.some((bgManifest) => bgManifest.replace(toRemove, "") === entryName),
  );

  if (!bgWebpackEntry) {
    throw new TypeError(bgScriptEntryErrorMsg.get());
  }

  const contentEntries: unknown = contentScripts
    ? flatMapDeep(Object.keys(webpackEntry), (entryName) =>
        contentScripts.map(({ js }) =>
          js.map((contentItem) => contentItem.replace(toRemove, "")).filter((contentItem) => contentItem === entryName),
        ),
      )
    : null;
  return {
    background: bgWebpackEntry,
    contentScript: contentEntries as string[],
    extensionPage: null,
  };
}
