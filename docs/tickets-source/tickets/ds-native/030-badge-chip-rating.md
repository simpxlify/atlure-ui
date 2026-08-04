---
id: "030"
title: "Badge / Chip / UrgencyBadge and StarRating"
repo: atlure-ui
epic: ds-native
priority: P0
size: M
serialize: "No"
milestone: M2
blocked_by: "027 Text primitive and the typography scale; 026 @atlure/icons: one lucide wrapper for native and web"
labels: "epic:ds-native; type:component"
---

# Badge / Chip / UrgencyBadge and StarRating

## Context

21 of the 33 prototype screens import `Badge`, and the domain adds two recurring specialisations: an urgency indicator (`low | medium | high`, on every service request) and a star rating (on every sitter, pet and review). Building the domain-aware variants here rather than in each screen stops 29 screen agents from each inventing their own colour mapping for `high`.

## Scope

- `Badge` in `packages/ui/src/components/badge.tsx` with `variant`: `default`, `secondary`, `outline`, `success`, `warning`, `destructive`; `size`: `sm`, `default`.
- `Chip` — a pressable, selectable badge with `selected` state, used by the sitter filter row. Includes an optional trailing dismiss affordance with its own `accessibilityLabel`.
- `UrgencyBadge` taking `urgency: Urgency` from `@atlure/types` and mapping `low`/`medium`/`high` onto `secondary`/`warning`/`destructive`. The mapping is exhaustive over the union, so adding a member is a typecheck failure, not a silent default.
- `StarRating` taking `value: number` and `max` (default 5), rendering filled/half/empty star icons from `@atlure/icons`; `size` variants; optional `showValue` rendering the numeric rating; an `interactive` mode emitting `onChange` for the leave-review flow.
- Stories for all variants plus every urgency value and ratings at 0, 3.5 and 5.

## Out of scope

Money, distance and duration formatting (ticket 032). The review-submission screen (epic `paw-screens`). Web variants (ticket 042).

## Files you own

`packages/ui/src/components/badge.tsx`, `chip.tsx`, `urgency-badge.tsx`, `star-rating.tsx`, `packages/ui/src/lib/recipes/badge.ts`, `apps/storybook-web/stories/Badge.stories.tsx`, `StarRating.stories.tsx`.

## Files you must NOT touch

`text.tsx`, `button.tsx`, `card.tsx`. `packages/types/**` — if `Urgency` needs changing, report on ticket 014. `packages/ui/src/index.ts`.

## Acceptance criteria

1. `pnpm --filter @atlure/ui test` exits 0.
2. A test asserts `UrgencyBadge` renders the destructive class for `high` and the secondary class for `low`, and a `@ts-expect-error` case proves an unhandled union member fails typecheck.
3. A test asserts `StarRating value={3.5} max={5}` renders 3 filled, 1 half and 1 empty star node.
4. A test asserts `StarRating interactive` calls `onChange` with `4` when the fourth star is pressed, and that non-interactive mode renders no pressable node.
5. A test asserts `Chip selected` yields a different `className` from unselected and that `accessibilityState.selected` is `true`.
6. `pnpm lint` exits 0 and the Storybook build includes every urgency value.

## Blocked by

- 026 @atlure/icons: one lucide wrapper for native and web
- 027 Text primitive and the typography scale
