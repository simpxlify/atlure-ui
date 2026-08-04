export const BARREL_HEADER = "/* atlure-generated-barrel-do-not-edit */";

const toPosix = (filePath) => filePath.split("\\").join("/");

const INTERNAL_MODULE_PATTERNS = [/(^|\/)index\.ts$/, /(^|\/)hooks\//, /(^|\/)utils\.ts$/];

const isPublishedModule = (filePath) => {
  const posixPath = toPosix(filePath);

  return (
    /\.tsx?$/.test(posixPath) &&
    !posixPath.endsWith(".d.ts") &&
    !/\.test\.tsx?$/.test(posixPath) &&
    !INTERNAL_MODULE_PATTERNS.some((pattern) => pattern.test(posixPath))
  );
};

const toModuleSpecifier = (filePath) => `./${toPosix(filePath).replace(/\.tsx?$/, "")}`;

export function buildBarrelSource(sourceFilePaths) {
  const specifiers = sourceFilePaths
    .filter(isPublishedModule)
    .map(toModuleSpecifier)
    .sort((left, right) => left.localeCompare(right));

  const uniqueSpecifiers = [...new Set(specifiers)];
  const exportLines = uniqueSpecifiers.map((specifier) => `export * from "${specifier}";`);

  return [BARREL_HEADER, "", ...exportLines, ""].join("\n");
}
