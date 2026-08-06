# @atlure/ui

## 0.5.0

### Minor Changes

- [#75](https://github.com/simpxlify/atlure-ui/pull/75) [`f0b5f33`](https://github.com/simpxlify/atlure-ui/commit/f0b5f337b590fe496a29e2a59349022224ebf614) Thanks [@simpxlify](https://github.com/simpxlify)! - Extend `Avatar` with a mandatory remote-image fallback path and add `AvatarGroup`.

  `Avatar` gains an `xs` size, a `shape` axis (`circle`, `rounded`), a `presence` dot (`online`,
  `offline`, `none`) carrying its state in an accessibility label, and a skeleton overlay while a
  remote image loads. A failed image now falls back to the initials instead of rendering a broken
  image node.

  `AvatarGroup` renders up to `max` avatars with a `+N` overflow badge, overlapping them with
  React Native-safe negative margins rather than `space-x-*`.

  Accessibility labels default to the avatar's `name` plus the presence variant name and carry no
  English prose, and `presenceAccessibilityLabel`, `loadingAccessibilityLabel` and
  `overflowAccessibilityLabel` let an app localize them.

  `src` is added as the image prop and `uri` is retained as an alias, so this is additive rather than a
  rename. Both are accepted and `src` wins if both are set. Dropping `uri` is owed before 1.0 and is
  tracked in issue #73.

- [#84](https://github.com/simpxlify/atlure-ui/pull/84) [`f48c624`](https://github.com/simpxlify/atlure-ui/commit/f48c624c4c6275165f779acb25b1fc628c0519f5) Thanks [@simpxlify](https://github.com/simpxlify)! - Add `Chip`, `UrgencyBadge` and `StarRating`, and extend `Badge` additively.

  `Badge` keeps every existing variant and size and gains `default` (same output as `primary`),
  `success`, `warning`, and size `default` (same output as `md`). Nothing was renamed or removed, so
  existing callers are untouched — the duplication this leaves behind is tracked in issue #73.

  `UrgencyBadge` maps `Urgency` onto badge variants through a `Record<Urgency, BadgeVariant>`, so the
  mapping is exhaustive by construction: adding a member to the union is a typecheck failure rather than
  a silent fallback.

  `StarRating` renders full, half and empty stars for any fractional value, with `sm`/`md`/`lg` sizes, an
  optional numeric readout, and an interactive mode that reports the pressed star for the leave-review
  flow. Non-interactive ratings render no pressable at all and announce the score as a single label.

  `Chip` is a selectable pill with an optional dismiss affordance that carries its own accessibility
  label. The dismiss control is a sibling of the chip body rather than nested inside it, so the two never
  render as nested buttons.

- [#81](https://github.com/simpxlify/atlure-ui/pull/81) [`ea2383e`](https://github.com/simpxlify/atlure-ui/commit/ea2383e584e213dcc8c72a28f72bf4a66389fc92) Thanks [@simpxlify](https://github.com/simpxlify)! - Add `Dialog`, `AlertDialog`, `Toast` and the overlay host they queue through.

  `PortalHost` mounts once at the app root and owns the overlay queue, so at most one dialog is visible
  at a time and a second one opened while the first is showing waits its turn instead of stacking.
  Overlays throw a named error when no host is mounted rather than failing silently.

  `Dialog` is a centred modal with `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogContent`
  and `DialogFooter`. It closes on backdrop press and on the Android hardware back button, marking that
  event handled. `AlertDialog` shares the base but cannot be dismissed implicitly: it renders no
  backdrop affordance and no back handler, so only the required `confirmLabel` or `cancelLabel` action
  closes it, with the confirm action painted from the destructive token when `isDestructive` is set.

  `ToastProvider` plus `useToast()` give a queue with `default`, `success` and `error` variants,
  per-toast auto-dismiss duration, swipe to dismiss, and
  `AccessibilityInfo.announceForAccessibility` on show so screen-reader users hear it.

  The overlay backdrop now lives in one place, `overlayBackdropClassName`, shared by `Sheet` and the
  dialogs rather than duplicated.

  The success toast paints from the `success` semantic token, which arrives in a separate tokens change.

- [#74](https://github.com/simpxlify/atlure-ui/pull/74) [`01e7ae8`](https://github.com/simpxlify/atlure-ui/commit/01e7ae88a323d4ca7f29a1601568341a9465093e) Thanks [@simpxlify](https://github.com/simpxlify)! - Add locale-aware format primitives and their label components.

  `LocaleProvider` / `useLocale()` carry a BCP-47 locale and a measurement system (`metric` default,
  `imperial` opt-in). `MoneyLabel`, `DistanceLabel`, `DurationLabel`, `DateLabel` and `DateRangeLabel`
  render through `Text`, so typography variants and tones still apply.

  Every symbol, unit, separator and date order comes from `Intl` rather than a literal: a price renders
  in its own currency regardless of the reader's locale, minor-unit decimal places are read back from
  `Intl` per currency instead of assumed to be two, and distances follow the active measurement system.
  `@atlure/ui` now depends on `@atlure/types` for the `Money` value type.

- [#83](https://github.com/simpxlify/atlure-ui/pull/83) [`998cff3`](https://github.com/simpxlify/atlure-ui/commit/998cff3848322b3daf54f67fc1d75b3311d5e887) Thanks [@simpxlify](https://github.com/simpxlify)! - Add `Progress`, determinate and indeterminate.

  A determinate bar takes `value` 0-100, clamps anything outside that, and reports `min`, `max` and
  `now` to screen readers. An indeterminate bar announces itself busy with no current value and loops a
  sliding fill, which stops as soon as the OS reduced-motion setting is known to be on.

  Also lands the value logic the sliders will sit on — snap-to-step, position/value conversion and the
  non-crossing range guard — as internal modules with tests. `Slider` and `RangeSlider` themselves are
  not in this change.

- [#77](https://github.com/simpxlify/atlure-ui/pull/77) [`46666c7`](https://github.com/simpxlify/atlure-ui/commit/46666c737b0ab97d3d8e3be4e0c489ca3fe3d4e4) Thanks [@simpxlify](https://github.com/simpxlify)! - Add `RadioGroup` / `RadioGroupItem` and `SettingsRow`, and complete the selection controls.

  `RadioGroup` shares its selected value through context and moves selection with the arrow keys on
  web, wrapping at both ends. `SettingsRow` is the labelled title/description row with a trailing
  control slot used by the notification, security and privacy screens, and it labels the control region
  with the row title so a bare `Switch` is never announced without a name.

  `Checkbox` gains an `isIndeterminate` state that reports `mixed` to assistive technology and resolves
  to checked when pressed, and now draws its mark with the `Check` and `Minus` icons instead of a plain
  filled box. `Switch` gains a `size` variant and animates the thumb between ends.

  Touch targets are now derived from each control's real geometry: `touchTargetHitSlopForSize` pads a
  control from its actual rendered size, so the 24dp checkbox and radio and the 28dp switch track all
  reach the 44dp minimum. They previously computed hit slop from the 40dp control-height token and
  resolved to 28-32dp.

  `checkboxBoxVariants` renames its `isChecked` variant to `isSelected`, since the box is filled for
  both the checked and indeterminate states, and `checkboxIndicatorVariants` is removed now that the
  indicator is an icon.

- [#79](https://github.com/simpxlify/atlure-ui/pull/79) [`073d25e`](https://github.com/simpxlify/atlure-ui/commit/073d25ef3d4297304bad575cde8f7bf8eb75d978) Thanks [@simpxlify](https://github.com/simpxlify)! - Add the `Sheet` primitive with `Select` and `Picker` built on top of it.

  `Sheet` is a bottom sheet over React Native's `Modal`, so it escapes parent clipping and renders
  above the tab bar without a portal. It has a backdrop that closes on press, drag-to-dismiss with
  configurable `snapPoints`, an Android hardware-back handler that marks the event handled, and it
  skips the slide animation when the OS reduced-motion setting is on.

  `Select` is a trigger styled with the shared input recipe that opens a sheet of options with a check
  mark on the selected one. It is generic over the option value type and uses `NoInfer` so a value
  outside the declared option union fails to typecheck rather than silently widening it. `Picker` is
  the multi-select variant returning an array.

  `useSheet()` exposes imperative `open`, `close` and `toggle` for screens that trigger a sheet from a
  header action.

- [#78](https://github.com/simpxlify/atlure-ui/pull/78) [`686ec6c`](https://github.com/simpxlify/atlure-ui/commit/686ec6c53df63ca70844079eed0bce94e6a6c310) Thanks [@simpxlify](https://github.com/simpxlify)! - Add `Tabs`, `SegmentedControl` and `ScreenHeader`.

  `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent` are context-driven and work controlled or
  uncontrolled. The active indicator animates between triggers using their measured layout, the trigger
  row scrolls horizontally when it overflows, and content mounts lazily: a panel is absent from the tree
  until its tab is first activated, then stays mounted and hidden so switching back does not refetch.

  `SegmentedControl` is the compact two-to-four-option pill for role and filter switching, rendered as a
  single bordered group.

  `ScreenHeader` carries a title, optional subtitle, a `large` variant for the dashboard greeting, a
  trailing slot for up to two `IconButton`s, and a back affordance announced as `Go back` that appears
  only when `onBack` is given. Its top safe-area inset arrives as the `topInset` prop, which keeps
  `react-native-safe-area-context` an optional peer dependency rather than a hard requirement.

### Patch Changes

- Updated dependencies [[`9e79f78`](https://github.com/simpxlify/atlure-ui/commit/9e79f7829ba9da7efc1a9ba44a90b2f6b5e64085), [`bead6ab`](https://github.com/simpxlify/atlure-ui/commit/bead6ab0c6a1563a1f62a0d89a05c35ea7f71cfa)]:
  - @atlure/icons@0.5.0
  - @atlure/tokens@0.5.0
  - @atlure/types@0.5.0

## 0.4.0

### Minor Changes

- [#71](https://github.com/simpxlify/atlure-ui/pull/71) [`d5a9526`](https://github.com/simpxlify/atlure-ui/commit/d5a9526e0d5ebfff45f20eb525849b0f9c073350) Thanks [@simpxlify](https://github.com/simpxlify)! - Add textareaHeight token group and reroute Textarea min-h through it

### Patch Changes

- Updated dependencies [[`d5a9526`](https://github.com/simpxlify/atlure-ui/commit/d5a9526e0d5ebfff45f20eb525849b0f9c073350)]:
  - @atlure/tokens@0.4.0
  - @atlure/icons@0.4.0

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
