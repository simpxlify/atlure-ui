---
id: "028"
title: "Button and IconButton"
repo: atlure-ui
epic: ds-native
priority: P0
size: M
serialize: "No"
milestone: M2
blocked_by: "027 Text primitive and the typography scale"
labels: "epic:ds-native; type:component"
---

# Button and IconButton

## Context

`Button` is the most-used primitive in the prototype — 26 of the 33 screen files import it. It is also half of the M2 gate: a `Button` from the published `@atlure/ui` must render in Atlure orange on a real device and in a web page. The shared cva recipe here is imported unchanged by `@atlure/ui-web`, so the recipe is a cross-package contract.

## Scope

- `Button` in `packages/ui/src/components/button.tsx` built on RN `Pressable`, forwarding refs.
- Recipe `packages/ui/src/lib/recipes/button.ts` with `variant`: `default` (primary orange), `secondary`, `outline`, `ghost`, `destructive`, `link`; `size`: `sm`, `default`, `lg`, `icon`. Heights come from the Tailwind height scale (`h-9`, `h-10`, `h-12`) — not a bespoke `buttonHeight` JS lookup, which is what the salvaged tokens did.
- Uses `TextClassContext` so a bare string child gets the right foreground colour per variant.
- `disabled` state applies reduced opacity and blocks `onPress`. `loading` prop renders a spinner and blocks `onPress`.
- `IconButton` as a thin wrapper fixing `size="icon"` and requiring an `accessibilityLabel`.
- Accessibility: `accessibilityRole="button"`, `accessibilityState` reflecting `disabled` and `busy`, minimum 44x44 hit target on every size including `sm`.
- Stories covering the full variant/size matrix plus disabled and loading, light and dark.

## Out of scope

The web `Button` render layer (ticket 041) — but the recipe you write here is what it imports, so keep it free of RN-only classes. Any screen usage.

## Files you own

`packages/ui/src/components/button.tsx`, `packages/ui/src/components/icon-button.tsx`, `packages/ui/src/lib/recipes/button.ts`, `apps/storybook-web/stories/Button.stories.tsx`.

## Files you must NOT touch

`packages/ui/src/components/text.tsx` and `text-class-context.tsx` (ticket 027) — consume them, do not edit them. `packages/tailwind-preset/**`. `packages/ui/src/index.ts`.

## Acceptance criteria

1. `pnpm --filter @atlure/ui test` exits 0.
2. A render test asserts `variant="default"` yields a `className` containing `bg-primary`, and `variant="destructive"` yields `bg-destructive`.
3. A test asserts `onPress` is not called when `disabled` is true, and not called when `loading` is true.
4. A test asserts every `size` produces a resolved minimum height of at least 44 device-independent pixels, and that `accessibilityRole` is `button` on all variants.
5. `grep -rn "space-x-\|divide-\|grid" packages/ui/src/lib/recipes/button.ts` prints nothing — the recipe stays inside the RN-safe Tailwind subset because `@atlure/ui-web` shares it.
6. The Storybook build renders 24 or more Button permutations and `pnpm lint` exits 0.

## Blocked by

- 027 Text primitive and the typography scale
