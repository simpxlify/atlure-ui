# @atlure/tokens

## 0.11.0

### Minor Changes

- [#103](https://github.com/simpxlify/atlure-ui/pull/103) [`86a684c`](https://github.com/simpxlify/atlure-ui/commit/86a684cebf37bc1321edb2f8922fec5a2b81ca53) Thanks [@simpxlify](https://github.com/simpxlify)! - Add `textareaHeight` token group keyed by row count (2/3/4/6), derived from `lineHeight.base` plus twice `spacing.sm`. Textarea `rows` variant now consumes `min-h-textarea-{rows}` classes in place of the stopgap `min-h-16 / 24 / 28 / 40` (ui #66).

## 0.10.0

## 0.9.0

## 0.8.0

## 0.7.0

## 0.6.1

## 0.6.0

## 0.5.0

### Minor Changes

- [#80](https://github.com/simpxlify/atlure-ui/pull/80) [`bead6ab`](https://github.com/simpxlify/atlure-ui/commit/bead6ab0c6a1563a1f62a0d89a05c35ea7f71cfa) Thanks [@simpxlify](https://github.com/simpxlify)! - Add `success` and `warning` semantic colors, with their `-foreground` twins.

  The palette gains green and amber/yellow entries, and both themes map them the way `destructive`
  already does: a deeper shade in light mode and a lighter one in dark, so the semantic reads as an
  accent against either background. `bg-success`, `text-success-foreground`, `bg-warning` and
  `text-warning-foreground` become available to every consumer of the Tailwind preset.

  This unblocks the Badge `success` / `warning` variants and the Toast `success` variant, both of which
  previously had no token to paint from.

## 0.4.0

### Minor Changes

- [#71](https://github.com/simpxlify/atlure-ui/pull/71) [`d5a9526`](https://github.com/simpxlify/atlure-ui/commit/d5a9526e0d5ebfff45f20eb525849b0f9c073350) Thanks [@simpxlify](https://github.com/simpxlify)! - Add textareaHeight token group and reroute Textarea min-h through it

## 0.3.0

### Patch Changes

- [#60](https://github.com/simpxlify/atlure-ui/pull/60) [`a8339df`](https://github.com/simpxlify/atlure-ui/commit/a8339df13489cdf634962830c51652000178f80c) Thanks [@simpxlify](https://github.com/simpxlify)! - Make both packages resolvable by non-ESM resolvers. Their root export declared only `types` and `import`, so anything that did not match the `import` condition failed outright with `ERR_PACKAGE_PATH_NOT_EXPORTED` — jest, postcss configs, and any `*.config.js`. Adding a `default` condition alongside `import` fixes it without changing what ESM consumers resolve to.

- [#59](https://github.com/simpxlify/atlure-ui/pull/59) [`d68ac75`](https://github.com/simpxlify/atlure-ui/commit/d68ac75461513f09ffd90931990deabee6244f32) Thanks [@simpxlify](https://github.com/simpxlify)! - Make the generated-artifact checksum guard actually guard. `pnpm --filter @atlure/tokens test` ran `generate` first, which rewrote every artifact **and** `checksum.json` before the comparison, so a hand-edit was silently regenerated away and the test could never fail. It now compiles the test sources only and compares the committed artifacts against the committed checksum.

## 0.2.0

### Minor Changes

- [`3d44338`](https://github.com/simpxlify/atlure-ui/commit/3d443385f8ab518c7399160e1128af3ce341457e) Thanks [@simpxlify](https://github.com/simpxlify)! - Initial release of the Atlure design system.

  `@atlure/tokens` is the single source of truth for colour, radius, spacing and type scales, generating the web CSS variables, the NativeWind stylesheet, the Tailwind preset, the React Native theme object and `NAV_THEME` from one file. `@atlure/types` carries the domain model. `@atlure/ui` provides eleven React Native components, shipped as untranspiled source so NativeWind's babel transform can apply. `@atlure/ui-web` provides the DOM component set the marketing site needs, with a parity test enforcing a consistent API surface across both platforms.
