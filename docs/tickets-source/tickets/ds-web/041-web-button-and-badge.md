---
id: "041"
title: "Web Button and Badge sharing the native recipes"
repo: atlure-ui
epic: ds-web
priority: P1
size: S
serialize: "No"
milestone: M2
blocked_by: "019 Scaffold @atlure/ui-web sharing cva recipes with the native package; 028 Button and IconButton; 030 Badge / Chip / UrgencyBadge and StarRating"
labels: "epic:ds-web; type:component"
---

# Web Button and Badge sharing the native recipes

## Context

`atlure-web` is marketing and SEO only, so `@atlure/ui-web` is deliberately small. The variant recipes are **shared** with `@atlure/ui` — this ticket writes only the DOM render layer, roughly fifteen lines per component. If a variant looks different between mobile and web, the bug is in the render layer, never in a forked recipe.

## Scope

- `Button` in `packages/ui-web/src/components/button.tsx` rendering a real `<button>`, importing the recipe from `@atlure/ui`. `asChild` support so it can render an `<a>` for links without nesting an anchor in a button.
- Native `disabled` attribute, `type` defaulting to `button` (not `submit`), and a `loading` state setting `aria-busy` and `disabled`.
- `Badge` rendering a `<span>` from the shared badge recipe.
- Visible focus ring using the token ring colour, since keyboard focus on the marketing site is an a11y-audit item.
- Stories in `apps/storybook-web` alongside the native ones so both are reviewed side by side.

## Out of scope

Any product UI. Forking or editing recipes — those live in `@atlure/ui` and belong to tickets 028 and 030. `IconButton`, `Chip`, `StarRating` — the marketing site has no interactive rating.

## Files you own

`packages/ui-web/src/components/button.tsx`, `badge.tsx`, `apps/storybook-web/stories/WebButton.stories.tsx`.

## Files you must NOT touch

`packages/ui/src/lib/recipes/**` — read-only. `packages/ui/src/components/**`. `packages/ui-web/src/index.ts` (generated).

## Acceptance criteria

1. `pnpm --filter @atlure/ui-web typecheck` and `test` both exit 0.
2. A test asserts the rendered element is `BUTTON` with `type="button"` by default, and that `asChild` with an `<a>` child renders a single `A` element with no nested `BUTTON`.
3. A test asserts `variant="default"` produces a `class` attribute containing `bg-primary`, matching the native assertion in ticket 028 — verified by importing the recipe and comparing the two outputs string-for-string in a test.
4. A test asserts `loading` sets both `aria-busy="true"` and `disabled`.
5. `grep -rn "cva(" packages/ui-web/src/components` prints nothing — no locally defined variants.
6. `axe` reports zero violations on the Button story: `pnpm test:a11y --grep WebButton` exits 0.

## Blocked by

- 019 Scaffold @atlure/ui-web sharing cva recipes with the native package
- 028 Button and IconButton
- 030 Badge / Chip / UrgencyBadge and StarRating
