import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const preset = require(resolve(packageRoot, "generated", "index.js"));
const postcss = require("postcss");
const tailwindcss = require("tailwindcss");

async function compile(markup) {
  const result = await postcss([
    tailwindcss({
      presets: [preset],
      content: [{ raw: markup, extension: "html" }],
      corePlugins: { preflight: false },
    }),
  ]).process("@tailwind utilities;", { from: undefined });
  return result.css;
}

describe("When tailwind consumes the generated preset", () => {
  it("loads as a commonjs module exposing a theme extension", () => {
    assert.equal(typeof preset, "object");
    assert.equal(preset.darkMode, "class");
    assert.ok(preset.theme.extend.colors);
  });

  it("compiles brand color utilities to the hsl custom property", async () => {
    const css = await compile('<div class="bg-primary text-primary-foreground border-border"></div>');
    assert.match(css, /\.bg-primary\s*\{[^}]*--tw-bg-opacity/);
    assert.match(css, /hsl\(var\(--primary\)/);
    assert.match(css, /hsl\(var\(--primary-foreground\)/);
    assert.match(css, /hsl\(var\(--border\)/);
  });

  it("supports the alpha shorthand the border token depends on", async () => {
    const css = await compile('<div class="border-border/20"></div>');
    assert.match(css, /hsl\(var\(--border\)\s*\/\s*0\.2\)/);
  });

  it("exposes the control height scale shared with react native", async () => {
    const css = await compile('<div class="h-control-md h-control-lg"></div>');
    assert.match(css, /\.h-control-md\s*\{\s*height:\s*2\.5rem/);
    assert.match(css, /\.h-control-lg\s*\{\s*height:\s*3rem/);
  });

  it("pairs every font size with a line height", async () => {
    const css = await compile('<div class="text-base"></div>');
    assert.match(css, /\.text-base\s*\{\s*font-size:\s*1rem;\s*line-height:\s*1\.5rem/);
  });

  it("emits no utility for a token that does not exist", async () => {
    const css = await compile('<div class="bg-nonexistent-token"></div>');
    assert.doesNotMatch(css, /bg-nonexistent-token/);
  });
});
