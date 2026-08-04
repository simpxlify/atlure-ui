import { describe, expect, it } from "vitest";

import { BARREL_HEADER, buildBarrelSource } from "./barrel-source.mjs";

describe("When building the barrel source", () => {
  it("exports every component and variant module", () => {
    const source = buildBarrelSource([
      "components/button/button.tsx",
      "variants/button-variants.ts",
      "lib/cn.ts",
    ]);

    expect(source).toContain('export * from "./components/button/button";');
    expect(source).toContain('export * from "./variants/button-variants";');
    expect(source).toContain('export * from "./lib/cn";');
  });

  it("omits tests, declaration files, barrels and internal helpers", () => {
    const source = buildBarrelSource([
      "index.ts",
      "variants/index.ts",
      "nativewind-env.d.ts",
      "components/button/button.tsx",
      "components/button/button.test.tsx",
      "components/avatar/utils.ts",
      "components/skeleton/hooks/use-pulse-opacity.ts",
      "notes.md",
    ]);

    expect(source.split("\n").filter((line) => line.startsWith("export"))).toEqual([
      'export * from "./components/button/button";',
    ]);
  });

  it("normalises windows separators and sorts deterministically", () => {
    const source = buildBarrelSource([
      "variants\\text-variants.ts",
      "components\\avatar\\avatar.tsx",
    ]);

    expect(source).toBe(
      [
        BARREL_HEADER,
        "",
        'export * from "./components/avatar/avatar";',
        'export * from "./variants/text-variants";',
        "",
      ].join("\n"),
    );
  });
});
