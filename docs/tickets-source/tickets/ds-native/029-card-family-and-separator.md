---
id: "029"
title: "Card family and Separator"
repo: atlure-ui
epic: ds-native
priority: P0
size: S
serialize: "No"
milestone: M2
blocked_by: "027 Text primitive and the typography scale"
labels: "epic:ds-native; type:component"
---

# Card family and Separator

## Context

`Card` is the second-most-used primitive in the prototype — 24 of the 33 screen files import it — and it is the other half of the M2 gate alongside `Button`. Atlure's card border comes from a token that was `rgba(234,88,12,0.2)` in the salvaged theme; it is now a solid `border` token consumed as `border-border/20`, which is the one form that works in both web CSS variables and React Native.

## Scope

- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` in `packages/ui/src/components/card.tsx`, all forwarding refs and accepting `className`.
- `Card` variants: `default` (background + `border-border/20`), `elevated` (adds a shadow via RN-safe shadow classes), `interactive` (wraps in `Pressable` with a pressed state).
- `CardTitle` and `CardDescription` use `Text` with the appropriate typography variants; do not restyle text inline.
- `Separator` in `packages/ui/src/components/separator.tsx` with `orientation`: `horizontal`, `vertical`, using a bordered `View` of hairline thickness.
- Stories for each card composition and both separator orientations, light and dark.

## Out of scope

The web `Card` (ticket 041). Any list or grid layout — RN has no CSS grid and `grid` classes are banned in shared recipes. Screen-specific card variants such as the sitter card, which belong to their screen tickets.

## Files you own

`packages/ui/src/components/card.tsx`, `packages/ui/src/components/separator.tsx`, `packages/ui/src/lib/recipes/card.ts`, `apps/storybook-web/stories/Card.stories.tsx`.

## Files you must NOT touch

`text.tsx`, `button.tsx`. `packages/tokens/**`, `packages/tailwind-preset/**`. `packages/ui/src/index.ts`.

## Acceptance criteria

1. `pnpm --filter @atlure/ui test` exits 0.
2. A render test asserts the default `Card` `className` contains `border-border/20` and `bg-card`.
3. `grep -rn "rgba(" packages/ui/src/components/card.tsx` prints nothing.
4. A test asserts `variant="interactive"` calls `onPress` and that the non-interactive variants render no `Pressable`.
5. A test asserts `Separator` with `orientation="vertical"` renders a node whose width class differs from the horizontal case.
6. `pnpm lint` and `pnpm --filter storybook-web storybook:build` both exit 0.

## Blocked by

- 027 Text primitive and the typography scale
