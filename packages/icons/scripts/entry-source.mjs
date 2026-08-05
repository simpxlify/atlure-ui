export const GENERATED_HEADER = "/* atlure-generated-icons-do-not-edit */";

const SHARED_REEXPORTS = [
  'export type { IconProps, IconSizeName } from "./icon-props.js";',
  'export { iconSize } from "./icon-props.js";',
  'export type { IconName } from "./icon-names.js";',
  'export { ICON_NAMES } from "./icon-names.js";',
];

const byName = (left, right) => left.name.localeCompare(right.name);

export function buildIconNamesSource(iconNames) {
  const entries = [...new Set(iconNames)]
    .sort((left, right) => left.localeCompare(right))
    .map((name) => `  "${name}",`);

  return [
    GENERATED_HEADER,
    "",
    "export const ICON_NAMES = [",
    ...entries,
    "] as const;",
    "",
    "export type IconName = (typeof ICON_NAMES)[number];",
    "",
  ].join("\n");
}

export function buildWebEntrySource(iconNames) {
  const exportedNames = [...new Set(iconNames)]
    .sort((left, right) => left.localeCompare(right))
    .map((name) => `  ${name},`);

  return [
    GENERATED_HEADER,
    "",
    ...SHARED_REEXPORTS,
    "",
    "export {",
    ...exportedNames,
    '} from "lucide-react";',
    "",
  ].join("\n");
}

export function buildNativeEntrySource(iconModules) {
  const sorted = [...iconModules].sort(byName);

  return [
    GENERATED_HEADER,
    "",
    ...sorted.map(
      ({ name, modulePath }) => `import ${name} from "lucide-react-native/${modulePath}";`,
    ),
    "",
    'import { registerIconInterop } from "./register-icon-interop.js";',
    "",
    ...SHARED_REEXPORTS,
    "",
    "registerIconInterop([",
    ...sorted.map(({ name }) => `  ${name},`),
    "]);",
    "",
    "export {",
    ...sorted.map(({ name }) => `  ${name},`),
    "};",
    "",
  ].join("\n");
}
