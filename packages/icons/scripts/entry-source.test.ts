import { describe, expect, it } from "vitest";

import {
  GENERATED_HEADER,
  buildIconNamesSource,
  buildNativeEntrySource,
  buildWebEntrySource,
} from "./entry-source.mjs";
import { ICON_NAMES } from "./icon-names.mjs";
import { buildIconModuleMap, resolveIconModules } from "./lucide-module-map.mjs";

const BARREL_FIXTURE = [
  "export { default as Heart, default as HeartIcon } from './icons/heart.mjs';",
  "export { default as Edit3, default as PenLine } from './icons/pen-line.mjs';",
].join("\n");

describe("When building the icon name module", () => {
  it("emits a sorted, deduplicated const tuple behind the generated header", () => {
    const source = buildIconNamesSource(["Star", "Heart", "Star"]);

    expect(source.startsWith(GENERATED_HEADER)).toBe(true);
    expect(source).toContain('"Heart",\n  "Star",');
    expect(source.match(/"Star"/g)).toHaveLength(1);
    expect(source).toContain("export type IconName = (typeof ICON_NAMES)[number];");
  });
});

describe("When building the DOM entry", () => {
  it("re-exports every icon name from the lucide barrel", () => {
    const source = buildWebEntrySource(["Star", "Heart"]);

    expect(source).toContain('export {\n  Heart,\n  Star,\n} from "lucide-react";');
    expect(source).toContain('export type { IconProps, IconSizeName } from "./icon-props.js";');
  });
});

describe("When building the React Native entry", () => {
  it("imports each icon from its own module and registers interop before exporting", () => {
    const source = buildNativeEntrySource([
      { name: "Heart", modulePath: "icons/heart" },
      { name: "Edit3", modulePath: "icons/pen-line" },
    ]);

    expect(source).toContain('import Edit3 from "lucide-react-native/icons/pen-line";');
    expect(source).toContain('import Heart from "lucide-react-native/icons/heart";');
    expect(source).not.toContain('from "lucide-react-native"\n');
    expect(source.indexOf("registerIconInterop([")).toBeLessThan(source.indexOf("export {\n"));
  });
});

describe("When mapping icon names onto lucide modules", () => {
  it("resolves every alias the barrel declares for a module", () => {
    const moduleByAlias = buildIconModuleMap(BARREL_FIXTURE);

    expect(moduleByAlias.get("HeartIcon")).toBe("icons/heart");
    expect(moduleByAlias.get("Edit3")).toBe("icons/pen-line");
  });

  it("throws naming every icon the installed lucide build no longer exports", () => {
    expect(() => resolveIconModules(BARREL_FIXTURE, ["Heart", "Chrome", "Facebook"])).toThrow(
      /Chrome, Facebook/,
    );
  });
});

describe("When reading the committed icon name list", () => {
  it("holds no duplicates and no lucide alias suffixes", () => {
    expect(new Set(ICON_NAMES).size).toBe(ICON_NAMES.length);
    expect(ICON_NAMES.filter((name) => name.endsWith("Icon"))).toEqual([]);
  });
});
