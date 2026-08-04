---
id: "015"
title: Token parity test suite across all six generated artifacts
repo: atlure-ui
epic: ds-foundations
priority: P0
size: M
serialize: "No"
milestone: M1
blocked_by: "013 Scaffold the atlure-ui pnpm workspace with pinned dependencies"
labels: "epic:ds-foundations; type:test; area:tokens"
---

# Token parity test suite across all six generated artifacts

## Context

`packages/tokens/src/tokens.ts` is the only place a hex value may appear, and a generator emits six artifacts from it: a JS/TS theme object, `NAV_THEME` for expo-router, web CSS custom properties, the Tailwind 3.4 preset, a NativeWind `global.css`, and a Tailwind v4 `@theme` block. Token drift between these artifacts was the **number one failure of both previous attempts** — a token existed in light but not dark, or in CSS but not in the preset, and nobody noticed. The tokens package itself is written by the lead; this ticket adds the tests that keep it honest.

## Scope

Add `packages/tokens/test/parity.test.ts` (vitest). Assert, driven off the source `tokens.ts` and reading each generated artifact from disk:

- Every key in `semantic.light` exists in `semantic.dark`, and vice versa — set equality, not subset.
- Every semantic key appears as a CSS custom property in the web CSS output, in both `:root` and the dark selector.
- Every semantic key appears in the NativeWind `global.css` output, both themes.
- Every semantic key appears as a `colors` entry in the generated Tailwind preset.
- Every semantic key appears in the Tailwind v4 `@theme` block.
- Colour values in CSS artifacts are **space-separated HSL channels** (matching `/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/`), the one format identical across Tailwind 3 and NativeWind 4's CSS-variable runtime.
- `NAV_THEME` has both `light` and `dark`, each with `dark`, `colors` **and `fonts`** — React Navigation 7 requires `fonts` and the salvaged version omitted it.
- Regression assertions on three known prototype bugs: dark `primary` equals the orange `#ea580c` in HSL form and **not** `#f1f5f9`; `border` is a solid token (no `rgba(` anywhere in any artifact); `buttonHeight`, `inputHeight` and `fontSizes` resolve as Tailwind scale entries (`h-10`, `text-base`) rather than bespoke JS `Record` lookups.
- Spacing, radius and fontSize scale keys have parity across preset, web CSS and native CSS.

## Out of scope

Writing or editing the generator or `tokens.ts` — read-only from this ticket. The checksum test (ticket 016). Any component.

## Files you own

`packages/tokens/test/parity.test.ts` and any fixture helper under `packages/tokens/test/`.

## Files you must NOT touch

`packages/tokens/src/**` and `packages/tokens/scripts/**` — owned by the lead and frozen. If a parity assertion fails because the generator is wrong, report it on this ticket; do not fix it here.

## Acceptance criteria

1. `pnpm --filter @atlure/tokens test` exits 0 with at least 8 passing parity assertions.
2. Deliberately delete one key from `semantic.dark` in a scratch copy and confirm `pnpm --filter @atlure/tokens test` exits non-zero naming the missing key. Revert.
3. `grep -rn "rgba(" packages/tokens/dist packages/tokens/generated` prints nothing.
4. A test asserts `NAV_THEME.light.fonts` and `NAV_THEME.dark.fonts` are both defined and fails if either is removed.
5. A test asserts the dark `--primary` channel triple equals the light `--primary` channel triple (both the orange brand), and fails if dark is set to the stock shadcn `#f1f5f9`.

## Blocked by

- 013 Scaffold the atlure-ui pnpm workspace with pinned dependencies
