---
id: "039"
title: "Skeleton / Spinner / EmptyState / ErrorState and ListRow"
repo: atlure-ui
epic: ds-native
priority: P0
size: M
serialize: "No"
milestone: M2
blocked_by: "029 Card family and Separator; 028 Button and IconButton"
labels: "epic:ds-native; type:component"
---

# Skeleton / Spinner / EmptyState / ErrorState and ListRow

## Context

The prototype has **no loading, error or empty states anywhere** — every screen renders hard-coded arrays. Every one of the 29 screen tickets needs all three, and the mock adapter ships with configurable `latencyMs` and `failureRate` precisely so those states get built in phase one instead of retrofitted. Providing them here makes "render the loading state" a one-line job per screen instead of a design decision.

## Scope

- `Skeleton`: a shimmer block with `className` sizing, respecting reduced motion by falling back to a static tint.
- Composed skeletons matching the real layouts, so screens do not invent their own: `SkeletonCard`, `SkeletonListRow`, `SkeletonAvatarRow`.
- `Spinner`: sized activity indicator using the primary token colour.
- `EmptyState`: icon slot, title, description, optional primary action button. Screens pass domain copy.
- `ErrorState`: icon, title, a message derived from an `ErrorCode` from `@atlure/types` via an exhaustive mapping (so a new code is a typecheck failure), and a required `onRetry`.
- `ListRow`: the repeated leading-avatar / title / subtitle / trailing-slot row used by messages, notifications, bookmarks, settings and help lists, with a `chevron` option and press handling.
- `ScreenState` wrapper taking a `Result`-shaped state and switching between loading, error, empty and content, so a screen writes one component instead of four branches.

## Out of scope

The mock adapter and its failure injection (ticket 064). Per-screen copy. Web equivalents (ticket 044).

## Files you own

`packages/ui/src/components/skeleton.tsx`, `spinner.tsx`, `empty-state.tsx`, `error-state.tsx`, `list-row.tsx`, `screen-state.tsx`, `apps/storybook-web/stories/States.stories.tsx`.

## Files you must NOT touch

`card.tsx`, `button.tsx`, `avatar.tsx`. `packages/types/**` — if `ErrorCode` needs a new member, report on ticket 014. `packages/ui/src/index.ts`.

## Acceptance criteria

1. `pnpm --filter @atlure/ui test` exits 0.
2. A test asserts `ErrorState` renders a distinct message for each member of `ErrorCode`, driven by iterating the union, and a `@ts-expect-error` case proves an unmapped code fails typecheck.
3. A test asserts `ErrorState` calls `onRetry` once on the retry press, and that omitting `onRetry` is a typecheck error.
4. A test asserts `ScreenState` renders the skeleton while `status="loading"`, the error state for a failed `Result`, `EmptyState` for an empty `items` array, and children otherwise — four distinct assertions.
5. A test with reduced motion mocked true asserts `Skeleton` runs no animation.
6. `pnpm --filter storybook-web storybook:build` exits 0 with stories for all four states.

## Blocked by

- 028 Button and IconButton
- 029 Card family and Separator
