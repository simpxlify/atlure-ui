---
id: "045"
title: "Web ThemeProvider / dark mode and web feedback states"
repo: atlure-ui
epic: ds-web
priority: P1
size: S
serialize: "No"
milestone: M2
blocked_by: "019 Scaffold @atlure/ui-web sharing cva recipes with the native package; 039 Skeleton / Spinner / EmptyState / ErrorState and ListRow"
labels: "epic:ds-web; type:component"
---

# Web ThemeProvider / dark mode and web feedback states

## Context

The Tailwind preset sets `darkMode: "class"`, so something must put that class on `<html>` before first paint or the page flashes light before switching. On a server-rendered marketing site this has to be handled without a client round trip. The prototype's dark palette also set `--primary: #f1f5f9`, losing the orange brand entirely in dark mode — a leftover from stock shadcn that the token tests now guard, but the web theme must be verified against too.

## Scope

- `ThemeProvider` reading a cookie or `prefers-color-scheme`, exposing `theme` and `setTheme`, and persisting the choice.
- A blocking inline script snippet exported as a string that sets the `dark` class on `<html>` before hydration, eliminating the flash. `atlure-web` injects it in its root layout.
- `ThemeToggle` button with a proper `aria-label` reflecting the target state.
- Web `Skeleton`, `Spinner`, `EmptyState` and `ErrorState` render layers, sharing the recipes from `@atlure/ui` — the city pages need skeletons for streamed sitter lists.
- Import path for the generated web CSS custom properties documented in the package README, so `atlure-web` imports it once.

## Out of scope

Injecting the script into `atlure-web` (ticket 095). Any analytics or consent banner (ticket 104).

## Files you own

`packages/ui-web/src/theme/theme-provider.tsx`, `theme-script.ts`, `theme-toggle.tsx`, `packages/ui-web/src/components/skeleton.tsx`, `spinner.tsx`, `empty-state.tsx`, `error-state.tsx`, `apps/storybook-web/stories/WebTheme.stories.tsx`.

## Files you must NOT touch

`packages/tokens/**` — if dark `primary` is wrong, that is ticket 015. `packages/ui/src/**`. `packages/ui-web/src/index.ts`.

## Acceptance criteria

1. `pnpm --filter @atlure/ui-web test` exits 0.
2. A test renders the theme script into a JSDOM document with a stored preference of `dark` and asserts `document.documentElement.classList.contains("dark")` is true synchronously, before any React render.
3. A test asserts `setTheme("light")` removes the class and persists the value, and that a subsequent read returns `light`.
4. A test asserts the computed value of `--primary` in dark mode equals its light-mode value — the direct guard against the prototype's lost-brand bug.
5. A test asserts `ThemeToggle` has an `aria-label` that changes between modes.
6. A Playwright test loads the WebTheme story with `prefers-color-scheme: dark` emulated and asserts no light-coloured first paint, by sampling the background at the first frame.

## Blocked by

- 019 Scaffold @atlure/ui-web sharing cva recipes with the native package
- 039 Skeleton / Spinner / EmptyState / ErrorState and ListRow
