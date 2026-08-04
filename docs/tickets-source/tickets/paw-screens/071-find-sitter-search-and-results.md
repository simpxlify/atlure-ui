---
id: "071"
title: "Screen: find a sitter — search / results / paging and states"
repo: atlure-paw
epic: paw-screens
priority: P0
size: L
serialize: "No"
milestone: M4
blocked_by: "070 Screen: sitter filter panel; 065 Supabase adapter passing the same conformance suite as the mock; 039 Skeleton / Spinner / EmptyState / ErrorState and ListRow"
labels: "epic:paw-screens; type:screen; flow:search"
---

# Screen: find a sitter — search / results / paging and states

## Context

Reference: `atlure-spec-reference/src/app/components/FindSitter.tsx` — in the prototype it is barely a screen: a search input placeholdered "Search by name, location or services..." over a hard-coded list, with no paging, no loading state and no empty state. This is the core discovery flow and the M4 thin-slice step "search sitters by radius", so it is a real screen here: a `SitterPort.search` call driven by the filter store, cursor-paged, with all four states.

## Scope

- `SearchBar` with a 300 ms debounce feeding a text term into the filter store, plus a filter button showing the count of active filters.
- Location source: the device location via `expo-location` when permission is granted, otherwise the profile's city, otherwise a required manual entry. Permission denial is a first-class state with an explanation and a path to settings, never a silent empty list.
- Results as a virtualised list of sitter cards: avatar, name, `StarRating`, `DistanceLabel` from `distance_meters`, rate through `MoneyLabel` with the correct `per` unit, service-kind badges, and a bookmark toggle.
- Cursor paging on scroll via `Page<T>` with a footer spinner, a stable order, and no duplicate rows across pages.
- Pull to refresh. Sort control: distance (default), rating, price.
- All four states from `ScreenState`: skeleton list while loading, `ErrorState` with retry on a failed `Result`, `EmptyState` distinguishing "no sitters in this radius" (offering to widen it) from "no sitters match these filters" (offering to clear them).
- Tapping a result opens the sitter profile route carrying the sitter id, and a `from` param so back returns here rather than to the dashboard.
- Flip this route's `status` to `live`.

## Out of scope

The filter panel's contents (ticket 070). The map view (ticket 072). Booking (ticket 079). Any change to `SitterPort` (ticket 063) or the RPC (ticket 049).

## Files you own

The find-sitter route file, `src/screens/search/results/**`, `src/screens/search/use-sitter-search.ts`.

## Files you must NOT touch

`src/screens/search/filter-panel/**` and `src/search/filter-store.ts` (ticket 070) — consume them. `src/data/**`. Other route files.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test against the mock adapter with `latencyMs: 300` asserts the skeleton list is visible before results and gone after.
3. A test with `failureRate: 1` asserts `ErrorState` renders with a working retry that issues exactly one new request.
4. A test asserts the two empty cases render different copy and different primary actions: widen radius versus clear filters.
5. A test asserts scrolling to the end fetches the next page and that the combined rendered ids contain no duplicates over a 3-page walk.
6. A test with fake timers asserts typing five characters issues exactly one search call.
7. A test asserts a denied location permission renders the permission state and issues zero search calls until a location is supplied.
8. A test asserts a result row's distance text is derived from `distance_meters` and its price from `MoneyLabel`; `grep -rn "km\|mi\b" src/screens/search/results --include=*.tsx` finds no hard-coded unit strings.
9. A test asserts tapping a row navigates to the sitter route with both the id and the `from` param.

## Blocked by

- 039 Skeleton / Spinner / EmptyState / ErrorState and ListRow
- 065 Supabase adapter passing the same conformance suite as the mock
- 070 Screen: sitter filter panel
