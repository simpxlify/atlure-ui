---
id: "072"
title: "Screen: map"
repo: atlure-paw
epic: paw-screens
priority: P2
size: L
serialize: "No"
milestone: M5
blocked_by: "071 Screen: find a sitter — search / results / paging and states"
labels: "epic:paw-screens; type:screen; flow:search; area:maps"
---

# Screen: map

## Context

Reference: `atlure-spec-reference/src/app/components/MapScreen.tsx` — a static image with a `mapView` toggle between `standard` and `satellite` and a `selectedPet` detail popover. The real screen uses `react-native-maps` with Google Maps, which is a native dependency and needs API keys per platform. Exact sitter home coordinates are never returned by the API, so markers are placed on the approximate public location, and the screen must not imply street-level precision.

## Scope

- `react-native-maps` with the Google provider on both platforms. API keys via EAS secrets and `app.config.ts` extra fields — request the config change on ticket 058 rather than editing it here.
- Markers for search results, placed on the approximate public location, clustered when dense.
- Map type toggle (standard/satellite) matching the prototype.
- Tapping a marker opens a compact sitter card sheet with the same fields as a result row and a link to the full profile.
- The map reads the same filter store as the list, so switching between list and map preserves filters, and a viewport change updates the radius and re-queries with a debounce.
- A visible note that pin locations are approximate.
- Loading, error and empty states: an unavailable map (missing key or no network) renders an explanatory state with a link back to the list, never a blank grey rectangle.
- Flip this route's `status` to `live`.

## Out of scope

The live-tracking map (ticket 087) — that is a different screen with a different data source, though it may reuse the map wrapper you create; put any shared wrapper in `src/components/map/` and say so on the ticket. Offline maps. Turn-by-turn directions.

## Files you own

The map route file, `src/screens/map/**`, `src/components/map/**`.

## Files you must NOT touch

`app.config.ts` (ticket 058) — request key configuration there. `src/search/filter-store.ts` (ticket 070). `src/screens/search/**` (ticket 071).

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0, and `npx expo prebuild --clean` succeeds on both platforms with the maps native module.
2. A test asserts markers render one per search result and that tapping one opens the sheet with that sitter's name.
3. A test asserts the map type toggle switches between `standard` and `satellite` and persists the choice for the session.
4. A test asserts a viewport change with fake timers triggers exactly one re-query after the debounce, with a radius derived from the visible region.
5. A test asserts filters set in the list are reflected in the map's query without re-entering them.
6. A test asserts a missing API key renders the unavailable state with a link back to the list and issues zero map SDK calls.
7. A test asserts the approximate-location notice is present in the rendered output.

## Blocked by

- 071 Screen: find a sitter — search / results / paging and states
