import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildIconNamesSource,
  buildNativeEntrySource,
  buildWebEntrySource,
} from "./entry-source.mjs";
import { ICON_NAMES } from "./icon-names.mjs";
import { resolveIconModules } from "./lucide-module-map.mjs";

const packageRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourceRoot = join(packageRoot, "src");

const nativeBarrelPath = fileURLToPath(import.meta.resolve("lucide-react-native"));

const iconModules = resolveIconModules(readFileSync(nativeBarrelPath, "utf8"), ICON_NAMES);

const generatedFiles = [
  { fileName: "icon-names.ts", source: buildIconNamesSource(ICON_NAMES) },
  { fileName: "web.ts", source: buildWebEntrySource(ICON_NAMES) },
  { fileName: "native.ts", source: buildNativeEntrySource(iconModules) },
];

for (const { fileName, source } of generatedFiles) {
  const filePath = join(sourceRoot, fileName);
  const previousSource = (() => {
    try {
      return readFileSync(filePath, "utf8");
    } catch {
      return "";
    }
  })();

  if (previousSource === source) {
    console.log(`icons entry up to date: src/${fileName}`);
    continue;
  }

  writeFileSync(filePath, source, "utf8");
  console.log(`icons entry written: src/${fileName}`);
}
