---
id: "037"
title: "Tabs / SegmentedControl and ScreenHeader"
repo: atlure-ui
epic: ds-native
priority: P1
size: S
serialize: "No"
milestone: M2
blocked_by: "028 Button and IconButton; 026 @atlure/icons: one lucide wrapper for native and web"
labels: "epic:ds-native; type:component"
---

# Tabs / SegmentedControl and ScreenHeader

## Context

Nearly every prototype screen begins with the same header shape — a back chevron, a title, and zero to two trailing actions — and several screens (activity, bookmarks, help, schedule) segment their content with tabs. Providing both here means 29 screen tickets do not each reimplement a header, and back-navigation behaviour stays consistent with the transition table in the prototype's `handleBack`.

## Scope

- `ScreenHeader`: `title`, optional `subtitle`, an `onBack` handler rendering a chevron with an `accessibilityLabel` of `Go back`, and a `right` slot for up to two `IconButton`s. Safe-area top inset aware. A `variant="large"` for the dashboard-style greeting header.
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`: context-driven, controlled or uncontrolled, with an animated active indicator, horizontally scrollable when triggers overflow, and `accessibilityRole="tab"` plus `accessibilityState.selected`.
- `SegmentedControl`: the compact two-to-four-option pill used for role and filter switching, sharing the tabs context internals but rendering as a single bordered group.
- Lazy content mounting: `TabsContent` mounts on first activation and stays mounted, so switching tabs does not refetch.

## Out of scope

The bottom tab bar — that is expo-router navigation and belongs to ticket 059. Any screen content.

## Files you own

`packages/ui/src/components/screen-header.tsx`, `tabs.tsx`, `segmented-control.tsx`, `apps/storybook-web/stories/Tabs.stories.tsx`, `ScreenHeader.stories.tsx`.

## Files you must NOT touch

`button.tsx`, `icon-button.tsx`, `text.tsx`. Anything in `atlure-paw`. `packages/ui/src/index.ts`.

## Acceptance criteria

1. `pnpm --filter @atlure/ui test` exits 0.
2. A test asserts `ScreenHeader` renders a pressable with `accessibilityLabel` `Go back` only when `onBack` is provided, and calls it once on press.
3. A test asserts exactly one `TabsTrigger` has `accessibilityState.selected === true` at any time.
4. A test asserts `TabsContent` for an inactive tab is not mounted initially, is mounted after activation, and remains mounted after switching away.
5. A test asserts `SegmentedControl` with 4 options renders 4 pressables and calls `onValueChange` with the pressed option's value.
6. `pnpm lint` and the Storybook build both exit 0.

## Blocked by

- 026 @atlure/icons: one lucide wrapper for native and web
- 028 Button and IconButton
