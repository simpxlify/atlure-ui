import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { kebabCase, toCssChannels } from "../src/color.js";
import {
  controlHeight,
  fontSize,
  lineHeight,
  radius,
  semantic,
  spacing,
  type SemanticScale,
} from "../src/tokens.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(scriptDir, "..", "..");
const generatedDir = join(packageRoot, "generated");
const presetDir = resolve(packageRoot, "..", "tailwind-preset", "generated");

const GENERATED_BANNER = "atlure-generated-do-not-edit";

function cssVariableBlock(scale: SemanticScale, indent: string): string {
  return (Object.keys(scale) as Array<keyof SemanticScale>)
    .map((token) => `${indent}--${kebabCase(token)}: ${toCssChannels(scale[token])};`)
    .join("\n");
}

function scaleBlock(indent: string): string {
  const lines: string[] = [];
  lines.push(`${indent}--radius: ${radius.lg / 16}rem;`);
  for (const [key, value] of Object.entries(radius)) {
    lines.push(`${indent}--radius-${key}: ${key === "full" ? "9999px" : `${value / 16}rem`};`);
  }
  for (const [key, value] of Object.entries(spacing)) {
    lines.push(`${indent}--spacing-${key}: ${value / 16}rem;`);
  }
  for (const [key, value] of Object.entries(fontSize)) {
    lines.push(`${indent}--font-size-${key}: ${value / 16}rem;`);
  }
  for (const [key, value] of Object.entries(controlHeight)) {
    lines.push(`${indent}--control-height-${key}: ${value / 16}rem;`);
  }
  return lines.join("\n");
}

function buildWebCss(): string {
  return [
    `@layer base {`,
    `  :root {`,
    cssVariableBlock(semantic.light, "    "),
    scaleBlock("    "),
    `  }`,
    ``,
    `  .dark:root {`,
    cssVariableBlock(semantic.dark, "    "),
    `  }`,
    `}`,
    ``,
  ].join("\n");
}

function buildNativeCss(): string {
  return [
    `@tailwind base;`,
    `@tailwind components;`,
    `@tailwind utilities;`,
    ``,
    `:root {`,
    cssVariableBlock(semantic.light, "  "),
    scaleBlock("  "),
    `}`,
    ``,
    `.dark:root {`,
    cssVariableBlock(semantic.dark, "  "),
    `}`,
    ``,
  ].join("\n");
}

function buildTailwindV4Theme(): string {
  const colorVars = (Object.keys(semantic.light) as Array<keyof SemanticScale>)
    .map((token) => `  --color-${kebabCase(token)}: hsl(var(--${kebabCase(token)}));`)
    .join("\n");
  return [`@theme inline {`, colorVars, `}`, ``].join("\n");
}

function buildTailwindPreset(): string {
  const colors = (Object.keys(semantic.light) as Array<keyof SemanticScale>)
    .map((token) => `    "${kebabCase(token)}": "hsl(var(--${kebabCase(token)}) / <alpha-value>)",`)
    .join("\n");

  const borderRadius = Object.entries(radius)
    .map(([key, value]) => `    "${key}": "${key === "full" ? "9999px" : `${value / 16}rem`}",`)
    .join("\n");

  const spacingEntries = Object.entries(spacing)
    .map(([key, value]) => `    "${key}": "${value / 16}rem",`)
    .join("\n");

  const fontSizeEntries = Object.entries(fontSize)
    .map(([key, value]) => {
      const leading = lineHeight[key as keyof typeof lineHeight];
      return `    "${key}": ["${value / 16}rem", { lineHeight: "${leading / 16}rem" }],`;
    })
    .join("\n");

  const heightEntries = Object.entries(controlHeight)
    .map(([key, value]) => `    "control-${key}": "${value / 16}rem",`)
    .join("\n");

  return [
    `const preset = {`,
    `  darkMode: "class",`,
    `  theme: {`,
    `    extend: {`,
    `      colors: {`,
    colors,
    `      },`,
    `      borderRadius: {`,
    borderRadius,
    `      },`,
    `      spacing: {`,
    spacingEntries,
    `      },`,
    `      fontSize: {`,
    fontSizeEntries,
    `      },`,
    `      height: {`,
    heightEntries,
    `      },`,
    `      minHeight: {`,
    heightEntries,
    `      },`,
    `    },`,
    `  },`,
    `};`,
    ``,
    `module.exports = preset;`,
    `module.exports.default = preset;`,
    ``,
  ].join("\n");
}

function checksum(contents: Record<string, string>): string {
  const hash = createHash("sha256");
  for (const key of Object.keys(contents).sort()) {
    hash.update(key);
    hash.update(contents[key] as string);
  }
  return hash.digest("hex");
}

function write(target: string, contents: string): void {
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, contents, "utf8");
  process.stdout.write(`wrote ${target}\n`);
}

const artifacts: Record<string, string> = {
  "theme.css": buildWebCss(),
  "native.css": buildNativeCss(),
  "theme.v4.css": buildTailwindV4Theme(),
};

const presetArtifacts: Record<string, string> = {
  "index.js": buildTailwindPreset(),
};

for (const [name, contents] of Object.entries(artifacts)) {
  write(join(generatedDir, name), `/* ${GENERATED_BANNER} */\n${contents}`);
}

for (const [name, contents] of Object.entries(presetArtifacts)) {
  write(join(presetDir, name), `/* ${GENERATED_BANNER} */\n${contents}`);
}

const combined = { ...artifacts, ...presetArtifacts };
write(join(generatedDir, "checksum.json"), `${JSON.stringify({ sha256: checksum(combined) }, null, 2)}\n`);
