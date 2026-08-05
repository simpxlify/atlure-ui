# @atlure/ui-web

## 0.4.0

### Patch Changes

- Updated dependencies [[`d5a9526`](https://github.com/simpxlify/atlure-ui/commit/d5a9526e0d5ebfff45f20eb525849b0f9c073350)]:
  - @atlure/tailwind-preset@0.4.0

## 0.3.0

### Minor Changes

- [#62](https://github.com/simpxlify/atlure-ui/pull/62) [`2dbd220`](https://github.com/simpxlify/atlure-ui/commit/2dbd220a49b999b63441a6aded7178a7cdcfe29e) Thanks [@simpxlify](https://github.com/simpxlify)! - Add `IconButton`, a `link` variant and an `icon` size to the native `Button`, and wire its label colour through `TextClassProvider` so nested `Text` inherits it instead of each caller repeating classes.

  Adding `icon` to native closes a real parity divergence: web already had it and the gap was sitting in the parity test's allow-list, which is now empty for `button`. `link` was added to both platforms in the same shape — underlined on native, which has no `hover:`.

  **Fixes a defect in the web `Button`:** it never set `type`, so it defaulted to `submit` and any `Button` inside a `form` submitted it on click. It now defaults to `type="button"`, and a caller passing `type="submit"` still wins.

### Patch Changes

- Updated dependencies []:
  - @atlure/tailwind-preset@0.3.0

## 0.2.0

### Minor Changes

- [`3d44338`](https://github.com/simpxlify/atlure-ui/commit/3d443385f8ab518c7399160e1128af3ce341457e) Thanks [@simpxlify](https://github.com/simpxlify)! - Initial release of the Atlure design system.

  `@atlure/tokens` is the single source of truth for colour, radius, spacing and type scales, generating the web CSS variables, the NativeWind stylesheet, the Tailwind preset, the React Native theme object and `NAV_THEME` from one file. `@atlure/types` carries the domain model. `@atlure/ui` provides eleven React Native components, shipped as untranspiled source so NativeWind's babel transform can apply. `@atlure/ui-web` provides the DOM component set the marketing site needs, with a parity test enforcing a consistent API surface across both platforms.

- [#3](https://github.com/simpxlify/atlure-ui/pull/3) [`41015d6`](https://github.com/simpxlify/atlure-ui/commit/41015d6b86d107b3c387e898cebb027ed388cad5) Thanks [@simpxlify](https://github.com/simpxlify)! - Add `@atlure/ui-web`: Button, Card, Badge, Input, Accordion and the Container/Stack layout
  primitives for the marketing surface, built on Radix primitives.

  Web and native deliberately keep separate cva recipes, because React Native has no CSS
  pseudo-classes, no text style inheritance and no `inline-flex`. A parity test enforces the shared
  API surface instead, so variant and size option names cannot drift between platforms.

### Patch Changes

- Updated dependencies [[`3d44338`](https://github.com/simpxlify/atlure-ui/commit/3d443385f8ab518c7399160e1128af3ce341457e)]:
  - @atlure/tailwind-preset@0.2.0
