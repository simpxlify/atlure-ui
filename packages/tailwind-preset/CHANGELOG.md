# @atlure/tailwind-preset

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

## 0.2.0

### Minor Changes

- [`3d44338`](https://github.com/simpxlify/atlure-ui/commit/3d443385f8ab518c7399160e1128af3ce341457e) Thanks [@simpxlify](https://github.com/simpxlify)! - Initial release of the Atlure design system.

  `@atlure/tokens` is the single source of truth for colour, radius, spacing and type scales, generating the web CSS variables, the NativeWind stylesheet, the Tailwind preset, the React Native theme object and `NAV_THEME` from one file. `@atlure/types` carries the domain model. `@atlure/ui` provides eleven React Native components, shipped as untranspiled source so NativeWind's babel transform can apply. `@atlure/ui-web` provides the DOM component set the marketing site needs, with a parity test enforcing a consistent API surface across both platforms.
