---
id: "073"
title: "Screens: walk and sit services / home boarding services"
repo: atlure-paw
epic: paw-screens
priority: P1
size: M
serialize: "No"
milestone: M4
blocked_by: "071 Screen: find a sitter — search / results / paging and states"
labels: "epic:paw-screens; type:screen; flow:search"
---

# Screens: walk and sit services / home boarding services

## Context

References: `atlure-spec-reference/src/app/components/WalkSitServices.tsx` and `HomeBoardingServices.tsx`. They are the same screen twice: a titled list of sitters filtered to a service group, each with a `showFilters` toggle opening the shared filter panel with group-specific defaults, and `onSitterClick` carrying a `serviceType` that `handleBack` later uses to return to the correct browse screen. Because they are structurally identical they share one ticket and one implementation parameterised by service group.

## Scope

- One `ServiceBrowseScreen` component parameterised by service group, rendered by both route files.
- `walk-sit` covers the `dog-walking` and `pet-sitting` kinds; `home-boarding` covers `home-boarding` and `home-sitting`.
- Group-appropriate hero copy and a group-specific default filter state, opening the shared filter panel in the matching context.
- Sitter cards reuse the result-row component from ticket 071 — do not write a second card.
- Cursor paging, pull to refresh, and all four states, as in ticket 071.
- Tapping a sitter navigates to the sitter profile with a `from` param naming this browse route, so back returns here — the prototype encoded this as `selectedSitter.serviceType` in global state; here it is a route param.
- Flip both route entries' `status` to `live` — two lines, one per route.

## Out of scope

The filter panel (ticket 070). Sitter profile (ticket 078). Any change to `SitterPort`.

## Files you own

Both browse route files, `src/screens/service-browse/**`, two lines of `src/navigation/routes.ts`.

## Files you must NOT touch

`src/screens/search/**` (ticket 071) — import its result-row component read-only; if it needs a prop it does not have, report on 071. `src/search/filter-store.ts`. Other route files.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts the two routes render the same component with different `group` props and different hero copy.
3. A test asserts the `walk-sit` route queries only the `dog-walking` and `pet-sitting` kinds, and `home-boarding` only the other two, by asserting the kinds array passed to `SitterPort.search`.
4. A test asserts the sitter card is the component exported by `src/screens/search/results/`, not a local duplicate: `ls src/screens/service-browse | grep -c "card"` prints `0`.
5. A test asserts navigating to a sitter from the home-boarding route and pressing back returns to the home-boarding route, and likewise for walk-sit.
6. A test with `failureRate: 1` asserts `ErrorState` renders with a working retry on both routes.
7. `git diff --stat src/navigation/routes.ts` shows exactly two changed lines.

## Blocked by

- 071 Screen: find a sitter — search / results / paging and states
