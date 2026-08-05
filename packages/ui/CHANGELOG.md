# @atlure/ui

## 0.3.0

### Minor Changes

- [#62](https://github.com/simpxlify/atlure-ui/pull/62) [`2dbd220`](https://github.com/simpxlify/atlure-ui/commit/2dbd220a49b999b63441a6aded7178a7cdcfe29e) Thanks [@simpxlify](https://github.com/simpxlify)! - Add `IconButton`, a `link` variant and an `icon` size to the native `Button`, and wire its label colour through `TextClassProvider` so nested `Text` inherits it instead of each caller repeating classes.

  Adding `icon` to native closes a real parity divergence: web already had it and the gap was sitting in the parity test's allow-list, which is now empty for `button`. `link` was added to both platforms in the same shape — underlined on native, which has no `hover:`.

  **Fixes a defect in the web `Button`:** it never set `type`, so it defaulted to `submit` and any `Button` inside a `form` submitted it on click. It now defaults to `type="button"`, and a caller passing `type="submit"` still wins.

- [#65](https://github.com/simpxlify/atlure-ui/pull/65) [`190f575`](https://github.com/simpxlify/atlure-ui/commit/190f575785384afa794ba83e9e60597732556206) Thanks [@simpxlify](https://github.com/simpxlify)! - Add the loading, empty and error state set: `Spinner`, the `SkeletonCard` / `SkeletonListRow` / `SkeletonAvatarRow` compositions, `EmptyState`, `ErrorState`, `ListRow` and a `ScreenState` wrapper that switches between loading, error, empty and content. `Skeleton` now falls back to a static tint when the device asks for reduced motion.

- [#63](https://github.com/simpxlify/atlure-ui/pull/63) [`3f8b99f`](https://github.com/simpxlify/atlure-ui/commit/3f8b99f092877ac5d848e8b0d7ce3e9650b77a0c) Thanks [@simpxlify](https://github.com/simpxlify)! - Complete the native `Card` family with `CardTitle` and `CardDescription`, which render through `Text` typography variants rather than restyling text inline, and give `Card`, its sections and `Separator` explicit ref types. Adds recipe tests covering the card surface and border tokens and both separator orientations.

- [#58](https://github.com/simpxlify/atlure-ui/pull/58) [`20db74b`](https://github.com/simpxlify/atlure-ui/commit/20db74b61eaa38ef94354bf031eb7e702d0c5905) Thanks [@simpxlify](https://github.com/simpxlify)! - Give `Text` the typography scale the design system actually specifies, and a `TextClassContext` so container components can set descendant text colour.

  **Breaking:** the `variant` axis is now `display | h1 | h2 | h3 | body | bodySm | label | caption`, replacing `heading | title | subtitle | overline`. `tone` gains `inverse`, mapping to the `primary-foreground` token.

  React Native has no text style inheritance and no descendant selectors, so `Button` and `Card` cannot colour their labels by styling a parent. `TextClassProvider` gives them a way to do it once. Precedence is deliberate: an inherited class beats the default `tone`, and an explicit `className` on the `Text` beats both.

- [#64](https://github.com/simpxlify/atlure-ui/pull/64) [`70bcd96`](https://github.com/simpxlify/atlure-ui/commit/70bcd96401d3647c2699d9c88b6a1043282729a6) Thanks [@simpxlify](https://github.com/simpxlify)! - Add the native form control set: `Textarea` with a row-based minimum height and an optional character counter, `FormField` composing label, control, helper and error text, `SearchBar` with a debounced change callback and a clear affordance, and `FormScrollView` for keyboard avoidance. `Input` gains leading and trailing icon slots, a token-driven placeholder colour, and automatic label association, invalid, required and disabled state when rendered inside a `FormField`. `@atlure/ui` now depends on `@atlure/icons`, so consumers need `react-native-svg` installed.

### Patch Changes

- Updated dependencies [[`a8339df`](https://github.com/simpxlify/atlure-ui/commit/a8339df13489cdf634962830c51652000178f80c), [`de8837d`](https://github.com/simpxlify/atlure-ui/commit/de8837ddcd3669553989aafe1018d2710449f22b), [`d68ac75`](https://github.com/simpxlify/atlure-ui/commit/d68ac75461513f09ffd90931990deabee6244f32)]:
  - @atlure/tokens@0.3.0
  - @atlure/icons@0.3.0

## 0.2.0

### Minor Changes

- [`3d44338`](https://github.com/simpxlify/atlure-ui/commit/3d443385f8ab518c7399160e1128af3ce341457e) Thanks [@simpxlify](https://github.com/simpxlify)! - Initial release of the Atlure design system.

  `@atlure/tokens` is the single source of truth for colour, radius, spacing and type scales, generating the web CSS variables, the NativeWind stylesheet, the Tailwind preset, the React Native theme object and `NAV_THEME` from one file. `@atlure/types` carries the domain model. `@atlure/ui` provides eleven React Native components, shipped as untranspiled source so NativeWind's babel transform can apply. `@atlure/ui-web` provides the DOM component set the marketing site needs, with a parity test enforcing a consistent API surface across both platforms.

### Patch Changes

- Updated dependencies [[`3d44338`](https://github.com/simpxlify/atlure-ui/commit/3d443385f8ab518c7399160e1128af3ce341457e)]:
  - @atlure/tokens@0.2.0
