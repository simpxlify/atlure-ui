---
id: "036"
title: "Slider / RangeSlider and Progress"
repo: atlure-ui
epic: ds-native
priority: P1
size: S
serialize: "No"
milestone: M2
blocked_by: "027 Text primitive and the typography scale"
labels: "epic:ds-native; type:component"
---

# Slider / RangeSlider and Progress

## Context

The sitter search filters need a radius slider and a price-range slider — radius in particular is the input to the PostGIS `ST_DWithin` query, so its value must be metres, not an opaque 0-100 scale. `Progress` is used by onboarding and the walk-progress display on live tracking. React Native has no built-in slider that accepts `className`, so these are gesture implementations.

## Scope

- `Slider`: single-thumb, `min`/`max`/`step`, controlled `value`, `onValueChange` during drag and `onValueCommit` on release — screens must debounce network calls on commit, not on every frame.
- `RangeSlider`: two thumbs with a lower-bound guard so the thumbs cannot cross, emitting a `[min, max]` tuple.
- Built with `react-native-gesture-handler` and `react-native-reanimated`; declare both as peer dependencies and record them in the ticket so ticket 058 installs them in `atlure-paw` rather than an agent adding them ad hoc.
- Accessibility: `accessibilityRole="adjustable"`, `accessibilityValue` with min/max/now, and `accessibilityIncrements` so screen-reader users can adjust without dragging.
- `Progress`: determinate with `value` 0-100 and an indeterminate mode, tokenised orange fill, respecting reduced motion.
- Optional `formatLabel` render prop so the radius slider can display via `DistanceLabel` and the price slider via `MoneyLabel`.

## Out of scope

The filter screen itself (ticket 070). Wiring radius into a query. Web slider (ticket 042).

## Files you own

`packages/ui/src/components/slider.tsx`, `range-slider.tsx`, `progress.tsx`, `apps/storybook-web/stories/Slider.stories.tsx`.

## Files you must NOT touch

`packages/ui/package.json` beyond adding the two peer dependency entries. `sheet.tsx`, `input.tsx`. `packages/ui/src/index.ts`.

## Acceptance criteria

1. `pnpm --filter @atlure/ui test` exits 0.
2. A test asserts `Slider` with `min={500} max={50000} step={500}` snaps a simulated drag to a multiple of 500 and never emits a value outside the bounds.
3. A test asserts `onValueCommit` fires exactly once for a drag that emits ten `onValueChange` events.
4. A test asserts `RangeSlider` thumbs cannot cross: dragging the lower thumb past the upper clamps it and the emitted tuple is always ascending.
5. A test asserts `accessibilityValue` reports `min`, `max` and `now` on both components.
6. `node -e "const p=require('./packages/ui/package.json'); for (const d of ['react-native-gesture-handler','react-native-reanimated']) if(!p.peerDependencies[d]) process.exit(1)"` exits 0.

## Blocked by

- 027 Text primitive and the typography scale
