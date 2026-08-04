---
id: "025"
title: Storybook workbench in apps/ / never published
repo: atlure-ui
epic: ds-foundations
priority: P1
size: M
serialize: "No"
milestone: M2
blocked_by: "018 Scaffold @atlure/ui as a source-shipping package; 020 Generate every barrel index.ts from a glob at build time"
labels: "epic:ds-foundations; type:tooling; area:storybook"
---

# Storybook workbench in apps/ / never published

## Context

The design-system workbench must live in `apps/storybook-web`, outside any published package. That one structural decision makes the `0.0.40` leak — `.storybook/preview.d.ts`, `.rnstorybook/` typings and demo screen `.d.ts` files inside the published tarball — impossible to regress. Stories are the review surface for every component ticket in epics `ds-native` and `ds-web`.

## Scope

- `apps/storybook-web` as a private workspace package (`"private": true`, no `version` publishing).
- Storybook 9 with the react-vite builder, plus `react-native-web` aliasing so native `@atlure/ui` components render in the browser.
- Tailwind 3.4.19 configured via `@atlure/tailwind-preset` and importing the generated web CSS, so stories render in real Atlure colours.
- A light/dark toolbar toggle driving the `dark` class, so every story can be reviewed in both themes.
- Story files live **here**, not in `packages/*`. Convention: `apps/storybook-web/stories/<Component>.stories.tsx`.
- A `storybook:build` script producing a static build, so CI can publish a preview.

## Out of scope

Native Storybook (`.rnstorybook`) — deliberately not used; on-device verification is ticket 061. Writing component stories, which belong to each component ticket. Chromatic or visual regression (ticket 106).

## Files you own

`apps/storybook-web/**`.

## Files you must NOT touch

Anything under `packages/`. In particular do not add `*.stories.*` files to `packages/ui` or `packages/ui-web` — ticket 023's denylist will fail CI if you do, which is intentional.

## Acceptance criteria

1. `pnpm --filter storybook-web storybook:build` exits 0 and produces `apps/storybook-web/storybook-static/index.html`.
2. `node -e "const p=require('./apps/storybook-web/package.json'); if(p.private!==true) process.exit(1)"` exits 0.
3. `find packages -name "*.stories.*" -o -name ".storybook" -o -name ".rnstorybook" | wc -l` prints `0`.
4. The static build's CSS contains a `.bg-primary` rule: `grep -rc "bg-primary" apps/storybook-web/storybook-static/assets/*.css` is at least 1.
5. Toggling the toolbar theme control on any story changes the rendered background — verified by a Playwright assertion comparing the computed `background-color` of the story root in both modes and asserting they differ.

## Blocked by

- 018 Scaffold @atlure/ui as a source-shipping package
- 020 Generate every barrel index.ts from a glob at build time
