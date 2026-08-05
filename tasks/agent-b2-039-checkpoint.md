# Agent B2 — 039 loading / empty / error states

Branch `feature/ds-state-components`. Companions: `tasks/agent-b2-checkpoint.md` (029),
`tasks/agent-b2-033-checkpoint.md` (033), `tasks/agent-b-checkpoint.md` (026/027/016/028).

## Base is three feature branches deep

039 declares 028 and 029 as blockers, and `ListRow`'s chevron needs `@atlure/icons`. The branch
is `feature/ds-form-controls` (033, which already carries icons and the `@atlure/ui` ->
`@atlure/icons` dependency) with `feature/ds-card-and-separator` and
`feature/ds-button-and-icon-button` merged in. Basing it on 033 rather than re-adding the icons
dependency avoids two branches making the same `package.json` edit and conflicting later.

Retarget to `main` as the parents land.

## The `ErrorCode` blocker — AC2 cannot be met as written

The ticket asks for `ErrorState` to derive its message from an `ErrorCode` in `@atlure/types` via
an exhaustive mapping. **`@atlure/types` has no `ErrorCode` and no `Result`.** They exist, but in
`atlure-paw/src/data/result.ts`, which the design system cannot import.

Two separate problems, both reported on #17 and #42:

1. **No shared home.** The union is `not-found | unauthenticated | forbidden | validation-failed
   | conflict | rate-limited | unavailable | timed-out | cancelled | unknown`. The types
   (`ErrorCode`, `ResultError`, `Result`) belong in `@atlure/types`; the `ok`/`err` constructors
   cannot follow them, because `@atlure/types` is types-only with no runtime code, so they stay
   in `atlure-paw`.
2. **AC2 collides with the i18n rule even once the type moves.** `CONVENTIONS.md` requires every
   user-facing string to go through i18n and forbids hardcoded display text, so the design system
   must not own English copy per error code. The shape that satisfies both is an exhaustive
   `errorMessageKey(code)` in `@atlure/ui` returning an i18n *key* — still a typecheck failure
   when a code is added, but no copy in the DS.

So `ErrorState` currently takes `title`, `message`, `retryLabel` and a required `onRetry`, with
screens passing translated copy exactly as `EmptyState` does. AC3 is fully met; AC2 is blocked
rather than faked.

## Other decisions

- **`ScreenState` takes `status` + `isEmpty`, not a `Result`.** Same root cause: no shared
  `Result` type. `status`/`isEmpty` are UI concerns rather than domain ones, so this is not a
  forked domain type, and a thin adapter can map a real `Result` once #17 lands. Loading wins
  over emptiness deliberately — an empty array during a load is unknown, not empty, and there is
  a test pinning that.
- **`Spinner` reads a colour at runtime, the only component in the package that does.**
  `ActivityIndicator` colours itself from a `color` prop, not from a style, so there is no class
  that can reach it. It uses `useColorScheme()` plus `semantic[scheme].primary` from
  `@atlure/tokens`. The alternative was a NativeWind `cssInterop` registration like the one in
  `@atlure/icons`; rejected for now because importing `nativewind` at runtime inside `@atlure/ui`
  would put it in the test path, and the predecessor's notes already record `nativewind/test`
  misbehaving under vitest.
- **`react-native-web`'s `AccessibilityInfo.addEventListener` returns `undefined`**, where React
  Native returns an `EmitterSubscription`. The unguarded `subscription.remove()` crashed three
  tests including the pre-existing skeleton test, hence the optional call in
  `use-reduced-motion.ts`.
- **AC5 is asserted through the rendered element, not the Animated value.** `Animated.Value`'s
  `__getValue()` is internal and untyped (`error TS2551`), so the test mocks
  `isReduceMotionEnabled` to `true` and asserts the placeholder stays at `opacity: 1`, plus a
  truth table over the pure `shouldAnimateSkeleton`.
- Composed skeletons pass the caller's `accessibilityLabel` to each child block, so a screen
  reader announces the pending region once per placeholder rather than reading an unlabelled row.

## AC status

Met: 1 (84 -> 100 tests), 3, 4 (five assertions, including the loading-and-empty case), 5, 6
(`storybook:build` exits 0). **AC2 blocked** on `ErrorCode` having no shared home — see above.
Stories still cannot exist for native components (#61).
