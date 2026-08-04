---
id: "027"
title: "Text primitive and the typography scale"
repo: atlure-ui
epic: ds-native
priority: P0
size: S
serialize: "No"
milestone: M2
blocked_by: "018 Scaffold @atlure/ui as a source-shipping package; 026 @atlure/icons: one lucide wrapper for native and web"
labels: "epic:ds-native; type:component"
---

# Text primitive and the typography scale

## Context

Every other component depends on `Text`, so it lands first. React Native's `Text` does not inherit styles the way DOM text does, so the design system needs one wrapper carrying the token typography scale as variants. The old `pawlii/constants/theme.ts` held the only copy of the fontSize scale and was 100% commented out; the live scale now comes from `@atlure/tokens` via the Tailwind preset, so `text-base` and `text-2xl` resolve identically on both platforms.

## Scope

- `Text` in `packages/ui/src/components/text.tsx`, wrapping RN `Text`, forwarding refs, accepting `className`.
- A cva recipe in `packages/ui/src/lib/recipes/text.ts` with `variant`: `display`, `h1`, `h2`, `h3`, `body`, `bodySm`, `label`, `caption`, and `tone`: `default`, `muted`, `primary`, `destructive`, `inverse`.
- A `TextClassContext` provider so `Button` and `Card` can set descendant text colour without each caller repeating classes — RN has no CSS inheritance and no descendant selectors.
- Default `tone` maps to the `foreground` token, which is navy, not black.
- Stories in `apps/storybook-web/stories/Text.stories.tsx` covering every variant and tone, light and dark.

## Out of scope

Custom fonts or font loading — Atlure ships with the system font until brand assets exist. Web `Text` (the marketing site uses semantic HTML elements, ticket 041).

## Files you own

`packages/ui/src/components/text.tsx`, `packages/ui/src/lib/recipes/text.ts`, `packages/ui/src/lib/text-class-context.tsx`, `apps/storybook-web/stories/Text.stories.tsx`.

## Files you must NOT touch

`packages/ui/src/index.ts` (generated). `packages/tailwind-preset/**` — if a needed scale entry is missing, report it on ticket 015 rather than adding it here. Any other component file.

## Acceptance criteria

1. `pnpm --filter @atlure/ui typecheck` and `pnpm --filter @atlure/ui test` both exit 0.
2. A render test asserts `<Text variant="h1" />` produces a node whose `className` contains the h1 size class from the preset, and that no raw hex or numeric `fontSize` appears in the component source (`grep -n "fontSize" packages/ui/src/components/text.tsx` prints nothing).
3. `pnpm lint` exits 0, proving the no-raw-hex rule from ticket 016 is satisfied.
4. `pnpm --filter storybook-web storybook:build` exits 0 and the Text story renders 13 variant/tone combinations.
5. A test asserts a `Text` inside a `TextClassContext.Provider` picks up the provided class and that an explicit `className` on the `Text` wins over it.

## Blocked by

- 018 Scaffold @atlure/ui as a source-shipping package
- 026 @atlure/icons: one lucide wrapper for native and web
