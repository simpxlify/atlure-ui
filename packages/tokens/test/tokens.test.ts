import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { contrastRatio, hexToHsl, hslToHex, kebabCase, toCssChannels } from "../src/color.js";
import { NAV_THEME } from "../src/navigation.js";
import {
  controlHeight,
  textareaHeight,
  fontSize,
  lineHeight,
  radius,
  semantic,
  spacing,
  type SemanticScale,
} from "../src/tokens.js";

const testDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(testDir, "..", "..");
const generatedDir = join(packageRoot, "generated");
const presetFile = resolve(packageRoot, "..", "tailwind-preset", "generated", "index.js");
const GENERATED_BANNER = /^\/\* atlure-generated-do-not-edit \*\/\n/;

const tokenNames = Object.keys(semantic.light) as Array<keyof SemanticScale>;

describe("semantic scale integrity", () => {
  it("defines the same token set in light and dark", () => {
    assert.deepEqual(Object.keys(semantic.dark).sort(), tokenNames.slice().sort());
  });

  it("uses only 6-digit hex values, never rgba or named colors", () => {
    for (const scheme of ["light", "dark"] as const) {
      for (const token of tokenNames) {
        assert.match(semantic[scheme][token], /^#[0-9a-f]{6}$/i, `${scheme}.${token}`);
      }
    }
  });

  it("keeps the brand orange as primary in dark mode", () => {
    assert.equal(semantic.dark.primary, semantic.light.primary);
  });

  it("meets WCAG AA contrast for primary foreground on primary in both schemes", () => {
    for (const scheme of ["light", "dark"] as const) {
      const ratio = contrastRatio(semantic[scheme].primaryForeground, semantic[scheme].primary);
      assert.ok(ratio >= 3, `${scheme} primary contrast is ${ratio.toFixed(2)}, expected >= 3`);
    }
  });

  it("meets WCAG AA contrast for body text on background in both schemes", () => {
    for (const scheme of ["light", "dark"] as const) {
      const ratio = contrastRatio(semantic[scheme].foreground, semantic[scheme].background);
      assert.ok(ratio >= 4.5, `${scheme} body contrast is ${ratio.toFixed(2)}, expected >= 4.5`);
    }
  });
});

describe("color conversion", () => {
  it("round-trips every semantic token through hsl within tolerance", () => {
    for (const scheme of ["light", "dark"] as const) {
      for (const token of tokenNames) {
        const original = semantic[scheme][token];
        const roundTripped = hslToHex(hexToHsl(original));
        const a = Number.parseInt(original.slice(1), 16);
        const b = Number.parseInt(roundTripped.slice(1), 16);
        const drift = [16, 8, 0].map((shift) => Math.abs(((a >> shift) & 255) - ((b >> shift) & 255)));
        assert.ok(
          Math.max(...drift) <= 2,
          `${scheme}.${token} ${original} round-tripped to ${roundTripped}`,
        );
      }
    }
  });

  it("emits space-separated hsl channels usable by tailwind and nativewind", () => {
    assert.match(toCssChannels("#ea580c"), /^\d+(\.\d+)? \d+(\.\d+)?% \d+(\.\d+)?%$/);
  });

  it("kebab-cases compound token names", () => {
    assert.equal(kebabCase("primaryForeground"), "primary-foreground");
    assert.equal(kebabCase("chart1"), "chart-1");
  });

  it("rejects malformed hex input", () => {
    assert.throws(() => hexToHsl("#fff"));
    assert.throws(() => hexToHsl("not-a-color"));
  });
});

describe("generated artifact parity", () => {
  it("writes every artifact", () => {
    for (const artifact of ["theme.css", "native.css", "theme.v4.css", "checksum.json"]) {
      assert.ok(existsSync(join(generatedDir, artifact)), `${artifact} was not generated`);
    }
    assert.ok(existsSync(presetFile), "tailwind preset was not generated");
  });

  it("exposes every semantic token as a css variable in both light and dark", () => {
    const css = readFileSync(join(generatedDir, "theme.css"), "utf8");
    const sections = css.split(/:root\s*\{|\.dark:root\s*\{/);
    const lightBlock = sections[1] ?? "";
    const darkBlock = sections[2] ?? "";
    for (const token of tokenNames) {
      const name = `--${kebabCase(token)}:`;
      assert.ok(lightBlock.includes(name), `${name} missing from :root`);
      assert.ok(darkBlock.includes(name), `${name} missing from .dark:root`);
    }
  });

  it("exposes every semantic token in the nativewind stylesheet", () => {
    const css = readFileSync(join(generatedDir, "native.css"), "utf8");
    for (const token of tokenNames) {
      assert.ok(css.includes(`--${kebabCase(token)}:`), `--${kebabCase(token)} missing`);
    }
  });

  it("maps every semantic token into the tailwind preset with an alpha channel", () => {
    const preset = readFileSync(presetFile, "utf8");
    for (const token of tokenNames) {
      const name = kebabCase(token);
      assert.ok(
        preset.includes(`"${name}": "hsl(var(--${name}) / <alpha-value>)"`),
        `${name} missing from the tailwind preset`,
      );
    }
  });

  it("exposes the radius, spacing, font-size, control-height and textarea-height scales in the preset", () => {
    const preset = readFileSync(presetFile, "utf8");
    for (const key of Object.keys(radius)) assert.ok(preset.includes(`"${key}"`), `radius.${key}`);
    for (const key of Object.keys(spacing)) assert.ok(preset.includes(`"${key}"`), `spacing.${key}`);
    for (const key of Object.keys(fontSize)) assert.ok(preset.includes(`"${key}"`), `fontSize.${key}`);
    for (const key of Object.keys(controlHeight)) {
      assert.ok(preset.includes(`"control-${key}"`), `controlHeight.${key}`);
    }
    for (const key of Object.keys(textareaHeight)) {
      assert.ok(preset.includes(`"textarea-${key}"`), `textareaHeight.${key}`);
    }
  });

  it("derives every textareaHeight entry from lineHeight.base plus twice spacing.sm", () => {
    const verticalPadding = spacing.sm * 2;
    const expectedRows = [2, 3, 4, 6] as const;
    for (const rows of expectedRows) {
      const expected = lineHeight.base * rows + verticalPadding;
      assert.equal(
        textareaHeight[rows],
        expected,
        `textareaHeight.${rows} should equal ${expected}`,
      );
    }
  });

  it("exposes each textareaHeight row count in the preset as a rem value", () => {
    const preset = readFileSync(presetFile, "utf8");
    for (const [key, value] of Object.entries(textareaHeight)) {
      assert.ok(
        preset.includes(`"textarea-${key}": "${value / 16}rem"`),
        `textarea-${key} rem value missing from preset`,
      );
    }
  });

  it("produces a loadable commonjs preset with class-based dark mode", () => {
    const preset = readFileSync(presetFile, "utf8");
    assert.ok(preset.includes("module.exports"));
    assert.ok(preset.includes('darkMode: "class"'));
  });

  it("detects hand-edits to generated files via the committed checksum", () => {
    const recorded = JSON.parse(readFileSync(join(generatedDir, "checksum.json"), "utf8")) as {
      sha256: string;
    };
    const contents: Record<string, string> = {};
    for (const artifact of ["theme.css", "native.css", "theme.v4.css"]) {
      contents[artifact] = readFileSync(join(generatedDir, artifact), "utf8").replace(
        GENERATED_BANNER,
        "",
      );
    }
    contents["index.js"] = readFileSync(presetFile, "utf8").replace(GENERATED_BANNER, "");

    const hash = createHash("sha256");
    for (const key of Object.keys(contents).sort()) {
      hash.update(key);
      hash.update(contents[key] as string);
    }

    assert.equal(
      hash.digest("hex"),
      recorded.sha256,
      `a generated artifact has been hand-edited. One of ${Object.keys(contents)
        .sort()
        .join(", ")} no longer matches the checksum recorded by the generator. Change packages/tokens/src/tokens.ts and re-run "pnpm --filter @atlure/tokens generate" instead of editing generated output.`,
    );
  });
});

describe("react navigation theme", () => {
  it("provides the fonts key react navigation 7 requires", () => {
    for (const scheme of ["light", "dark"] as const) {
      assert.ok(NAV_THEME[scheme].fonts, `${scheme}.fonts missing`);
      for (const weight of ["regular", "medium", "bold", "heavy"] as const) {
        assert.ok(NAV_THEME[scheme].fonts[weight].fontFamily);
        assert.ok(NAV_THEME[scheme].fonts[weight].fontWeight);
      }
    }
  });

  it("provides every color key react navigation expects", () => {
    for (const scheme of ["light", "dark"] as const) {
      for (const key of ["primary", "background", "card", "text", "border", "notification"] as const) {
        assert.match(NAV_THEME[scheme].colors[key], /^#[0-9a-f]{6}$/i, `${scheme}.${key}`);
      }
    }
    assert.equal(NAV_THEME.light.dark, false);
    assert.equal(NAV_THEME.dark.dark, true);
  });
});
