import { readFileSync } from "fs";
import { flatMapDeep } from "lodash";
import { Compiler, Entry } from "webpack";
import { bgScriptEntryErrorMsg, bgScriptManifestRequiredMsg } from "../messages/errors";

export function extractEntries(
  webpackEntry: Entry,
  manifestPath: string,
  webpackOutput: Compiler["options"]["output"] = {},
): IEntriesOption {
  const manifestJson = JSON.parse(readFileSync(manifestPath).toString()) as IExtensionManifest;
  const { background, content_scripts } = manifestJson;
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

  const contentEntries: unknown = content_scripts
    ? flatMapDeep(Object.keys(webpackEntry), (entryName) =>
        content_scripts.map(({ js }) =>
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
