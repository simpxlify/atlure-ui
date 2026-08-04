---
id: "070"
title: "Screen: sitter filter panel"
repo: atlure-paw
epic: paw-screens
priority: P0
size: L
serialize: "No"
milestone: M4
blocked_by: "035 Sheet primitive / Select and Picker; 036 Slider / RangeSlider and Progress; 040 Calendar / DateRangePicker and TimePicker; 063 Data seam: one port per aggregate / Result / cursors and realtime"
labels: "epic:paw-screens; type:screen; flow:search"
---

# Screen: sitter filter panel

## Context

Reference: `atlure-spec-reference/src/app/components/FilterModal.tsx`. It is the filter surface shared by find-a-sitter and both service browse screens, with a `FilterState` of `petTypes`, `dateRange`, `budget` as a two-element tuple, `rating`, `distance`, `availability` and `serviceTypes`, and defaults that differ by `serviceType` (`walk-sit` versus `home-boarding`). Two things in the prototype must change: `budget` is a bare number pair with no currency, and `distance` is a bare `5` with no unit — the real query takes metres and a `Money` bound, because search is a PostGIS `ST_DWithin` call.

## Scope

- A bottom sheet built on `Sheet`, not a modal, opened from the search and browse screens.
- Filter groups: species multi-select, date range via `DateRangePicker`, price range via `RangeSlider` bounded in the user's preferred currency, minimum rating via `StarRating interactive`, radius via `Slider` in metres displayed through `DistanceLabel`, availability time-of-day multi-select, and service-kind multi-select.
- Defaults differ per entry context (`walk-sit` versus `home-boarding`) exactly as the prototype does, but expressed as minor-unit `Money` bounds in the profile's preferred currency.
- A live result count so the user sees the effect before applying, fetched with a debounced count-only query.
- `Clear all` restores the context defaults, not empty values.
- Applied filters are owned by a shared store (`src/search/filter-store.ts`) so the search and browse screens read the same state and the panel is stateless between opens. Filters serialise to and from route params so a filtered search is deep-linkable and survives a back navigation.
- Every control is reachable with a screen reader and the sheet announces the applied count on close.

## Out of scope

Running the search or rendering results (ticket 071). The browse screens (ticket 073). The map (ticket 072). Availability-aware backend filtering beyond what `search_sitters` accepts — if a filter has no backend support, disable it with an explanatory label and report on ticket 049.

## Files you own

`src/screens/search/filter-panel/**`, `src/search/filter-store.ts`, `src/search/filter-serialization.ts`.

## Files you must NOT touch

`src/screens/search/results/**` (ticket 071). Any route file — this is a sheet, not a route, so `routes.ts` is not touched by this ticket. `src/data/**`. `src/data/fixtures/**`.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts opening the panel in `home-boarding` context yields different default price bounds than `walk-sit`, and that `Clear all` returns to the context defaults rather than empty.
3. A test asserts the radius control emits metres: setting it to the 5 km position produces `radiusMeters: 5000` in the store, and the label rendered is `5.0 km`.
4. A test asserts the price bounds are `Money` values carrying the profile's preferred currency, and a `@ts-expect-error` case proves a bare number is rejected.
5. A test with fake timers asserts the live count query fires once for five rapid control changes.
6. A test asserts round-tripping a filter state through `filter-serialization` and back yields a deeply equal object, and that a route param string produces the same state on a cold open.
7. A test asserts a filter with no backend support renders disabled with an explanation and is excluded from the emitted query.

## Blocked by

- 035 Sheet primitive / Select and Picker
- 036 Slider / RangeSlider and Progress
- 040 Calendar / DateRangePicker and TimePicker
- 063 Data seam: one port per aggregate / Result / cursors and realtime
