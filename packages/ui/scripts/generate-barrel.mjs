import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildBarrelSource } from "./barrel-source.mjs";

const packageRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourceRoot = join(packageRoot, "src");
const barrelPath = join(sourceRoot, "index.ts");

function collectSourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    return entry.isDirectory() ? collectSourceFiles(entryPath) : [entryPath];
  });
}

const relativeSourceFiles = collectSourceFiles(sourceRoot).map((filePath) =>
  relative(sourceRoot, filePath),
);

const barrelSource = buildBarrelSource(relativeSourceFiles);
const previousBarrelSource = (() => {
  try {
    return readFileSync(barrelPath, "utf8");
  } catch {
    return "";
  }
})();

if (previousBarrelSource === barrelSource) {
  console.log("barrel up to date: src/index.ts");
} else {
  writeFileSync(barrelPath, barrelSource, "utf8");
  console.log("barrel written: src/index.ts");
}
