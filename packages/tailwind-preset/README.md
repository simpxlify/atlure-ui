# @atlure/tailwind-preset

The Tailwind preset shared by `atlure-web` (Tailwind) and `atlure-paw` (NativeWind), so a colour or
spacing value is defined once and resolves identically on both platforms.

**This package is generated.** Everything under `generated/` is emitted by `@atlure/tokens`; editing
it by hand fails the checksum test and CI's `git diff --exit-code`. To change a value, edit
`packages/tokens/src/tokens.ts` and run `pnpm build`.

## Usage

Web, in `tailwind.config.js`:

```js
module.exports = {
  presets: [require("@atlure/tailwind-preset")],
  content: ["./src/**/*.{ts,tsx}"],
};
```

Mobile, where the NativeWind preset must come first:

```js
module.exports = {
  presets: [require("nativewind/preset"), require("@atlure/tailwind-preset")],
  content: ["./app/**/*.{ts,tsx}", "./node_modules/@atlure/ui/src/**/*.{ts,tsx}"],
};
```

The `@atlure/ui` entry in `content` is required because that package ships untranspiled source.

## Why Tailwind 3.4 and not 4

NativeWind 4 is built on Tailwind 3.4's JS `presets` mechanism. Tailwind 4 replaced it with
CSS-first `@theme`, which cannot be shared with NativeWind 4 — so upgrading would mean maintaining
two separate token configs, the exact duplication that broke both predecessor design systems.
NativeWind 5 is preview-only and requires Tailwind 4. When it stabilises, `@atlure/tokens` already
emits a `theme.v4.css` block, so the migration is a config swap rather than a token rewrite.

## Tests

`pnpm test` runs Tailwind for real via PostCSS and asserts the compiled output, rather than merely
checking the preset object's shape:

- `bg-primary` resolves to `hsl(var(--primary) / <alpha-value>)`
- `border-border/20` resolves to `hsl(var(--border) / 0.2)` — the reason `border` is a solid token
  rather than the pre-multiplied `rgba` the prototype used
- `h-control-md` and `h-control-lg` resolve to the shared control-height scale
- `text-base` carries its paired line height
- an unknown token emits no utility
