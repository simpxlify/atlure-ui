# @atlure/tokens

The single source of truth for Atlure's visual language. Every color, radius, spacing, type and control-height value in the product originates in `src/tokens.ts` — nowhere else.

## Why this package exists

Two previous attempts at an Atlure design system (`pawlii-ui` and `pawlii-ui2`) both failed the same way: tokens were duplicated by hand across a JS theme object, a CSS variable file and a Tailwind config, and the copies drifted. This package makes that impossible by generating every downstream artifact from one file, and by failing the build if a generated file is edited by hand.

## One source, four generated artifacts plus two compiled modules

`src/tokens.ts` is the single source. Four files are emitted by `scripts/build-tokens.ts`; the JS theme object and `NAV_THEME` are hand-written modules that import from it and are compiled by `tsc`. The distinction matters: only the four emitted files are covered by the checksum guard.



| Artifact | Consumer |
|---|---|
| `dist/index.js` (`THEME`, `palette`, `semantic`, scales) | React Native runtime, `StatusBar`, splash, Reanimated |
| `dist/navigation.js` (`NAV_THEME`) | expo-router / React Navigation 7 |
| `generated/theme.css` | web, as `:root` and `.dark:root` custom properties |
| `generated/native.css` | the Expo app and `@atlure/ui`, via NativeWind |
| `generated/theme.v4.css` | unused today; a Tailwind 4 `@theme` block so migrating later is a config swap, not a token rewrite |
| `../tailwind-preset/generated/index.js` | `@atlure/tailwind-preset`, consumed by both web Tailwind and NativeWind |

Colors are emitted as **space-separated HSL channels** (`--primary: 20.5 90.2% 48.2%`). That is the one format which behaves identically in Tailwind 3 and NativeWind 4's CSS-variable runtime, and the only one supporting `hsl(var(--token) / <alpha-value>)`. The JS theme object keeps hex, because React Native APIs need literal colors.

## Commands

```
pnpm generate    regenerate all artifacts
pnpm build       generate, then compile src to dist
pnpm test        generate, then run the parity and contrast suite
pnpm typecheck
```

There is deliberately no `tsx`, no `vitest` and no `esbuild` here — just `typescript` and Node's built-in test runner. That keeps the package that everything else depends on as close to zero-dependency as possible.

## Three bugs fixed relative to the prototype

The palette was transcribed from the finalized prototype's `src/styles/globals.css`, with three corrections:

1. **Dark mode lost the brand.** The prototype set `--primary: #f1f5f9` in dark mode — leftover stock shadcn — so Atlure rendered as a grey app in dark mode. Primary is now the brand orange `#ea580c` in both schemes, and a test asserts it.
2. **`--border` was a pre-multiplied alpha color** (`rgba(234, 88, 12, 0.2)`), which cannot round-trip through the HSL-channel format and is unusable in React Native. `border` is now the solid brand orange; consumers write `border-border/20` to get the same visual result on both platforms.
3. **`--input: transparent` was not a color token.** It is now modeled explicitly, with a separate `inputBackground`.

`NAV_THEME` also gained the **`fonts` key** that React Navigation 7 requires and the predecessor omitted — a latent runtime crash.

## Enforcement

`pnpm test` is not a formality; it is what keeps the single-source-of-truth promise:

- every semantic token exists in **both** light and dark
- every token appears in the web CSS, the native CSS **and** the Tailwind preset — a missing key fails the build
- every color round-trips hex → HSL → hex within a 2/255 per-channel tolerance
- primary-on-primary-foreground meets WCAG AA (≥3:1) and body-on-background meets AA (≥4.5:1), in both schemes
- `NAV_THEME` satisfies React Navigation's expected shape
- a **checksum** over the generated files is committed; hand-editing any generated artifact fails the test

CI additionally runs `git diff --exit-code` after building, so a generated file that was not regenerated and committed fails the pipeline.

## Scales are Tailwind scales, not lookup tables

The predecessor exposed `buttonHeight`, `inputHeight` and `INPUT_HEIGHTS` as bespoke JS `Record<>` maps, which is why its `Button` became unmaintainable. Here, `radius`, `spacing`, `fontSize`, `lineHeight` and `controlHeight` are emitted as Tailwind scale entries, so `h-control-md` and `text-base` resolve identically on web and native.

## Adding or changing a token

Edit `src/tokens.ts`, run `pnpm build`, and commit the regenerated artifacts. Never edit anything under `generated/`. Adding a semantic token requires adding it to **both** `semantic.light` and `semantic.dark`, or the parity test fails.
