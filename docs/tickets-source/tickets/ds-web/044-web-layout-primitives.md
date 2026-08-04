---
id: "044"
title: "Web layout primitives: Container / Section / Stack / Grid / Prose"
repo: atlure-ui
epic: ds-web
priority: P1
size: S
serialize: "No"
milestone: M2
blocked_by: "019 Scaffold @atlure/ui-web sharing cva recipes with the native package"
labels: "epic:ds-web; type:component"
---

# Web layout primitives: Container / Section / Stack / Grid / Prose

## Context

The marketing site is nine page types, most of them generated per city, so consistent page rhythm has to come from primitives rather than per-page classes. These are web-only by nature: `grid`, `divide-*` and descendant selectors are banned in the shared native recipes precisely because React Native cannot express them, so they live here and nowhere else.

## Scope

- `Container`: max-width wrapper with responsive horizontal padding and a `size` variant (`prose`, `default`, `wide`).
- `Section`: vertical rhythm wrapper rendering `<section>`, with `tone` (`default`, `muted`, `primary`) mapping to token backgrounds, and an `as` prop for correct sectioning elements.
- `Stack` and `Row`: flex helpers with a `gap` prop from the token spacing scale, using `gap-*` rather than `space-x-*`.
- `Grid`: responsive CSS grid with a `cols` prop and named breakpoints, used by the city-page sitter lists and feature grids.
- `Prose`: typography wrapper for legal and article content (terms, privacy, help articles), styling headings, lists and links from tokens without a Tailwind typography plugin dependency.
- `VisuallyHidden` for skip links and screen-reader-only headings.

## Out of scope

Page-level composition, headers, footers and navigation — those are `atlure-web` (ticket 095). Any native equivalent; these must never be imported by `@atlure/ui`.

## Files you own

`packages/ui-web/src/components/container.tsx`, `section.tsx`, `stack.tsx`, `grid.tsx`, `prose.tsx`, `visually-hidden.tsx`, `apps/storybook-web/stories/WebLayout.stories.tsx`.

## Files you must NOT touch

`packages/ui/src/**` — no native package may import these. Other `packages/ui-web/src/components/` files. `packages/ui-web/src/index.ts`.

## Acceptance criteria

1. `pnpm --filter @atlure/ui-web test` exits 0.
2. A test asserts `Section as="footer"` renders a `FOOTER` element and `Section` with no `as` renders `SECTION`.
3. A test asserts `Grid cols={{ base: 1, md: 3 }}` produces class strings containing `grid-cols-1` and `md:grid-cols-3`.
4. A test asserts `Stack gap="4"` uses a `gap-` class and `grep -rn "space-x-\|space-y-" packages/ui-web/src/components/stack.tsx` prints nothing.
5. A test asserts `VisuallyHidden` content is present in `textContent` but has a computed `clip-path` or equivalent hiding it, and is not `display: none`.
6. `grep -rn "@atlure/ui-web" packages/ui/src` prints nothing — the native package must not depend on web layout.

## Blocked by

- 019 Scaffold @atlure/ui-web sharing cva recipes with the native package
