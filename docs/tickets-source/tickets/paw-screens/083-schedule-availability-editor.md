---
id: "083"
title: "Screen: schedule — sitter availability editor"
repo: atlure-paw
epic: paw-screens
priority: P1
size: M
serialize: "No"
milestone: M5
blocked_by: "081 Screen: schedule — month calendar; 040 Calendar / DateRangePicker and TimePicker; 048 Schema: sitter profiles / services and availability"
labels: "epic:paw-screens; type:screen; flow:schedule"
---

# Screen: schedule — sitter availability editor

## Context

Third of three schedule tickets, and the one with no prototype equivalent: the prototype shows availability as a read-only "This Week's Availability" strip on the sitter profile, with no way for a sitter to set it. But `sitter_availability` and `sitter_availability_exceptions` exist, radius search depends on them, and a sitter who cannot set availability cannot be booked correctly. This fills the tab that ticket 081 landed as a placeholder.

## Scope

- Weekly recurring windows: per weekday, add, edit and remove time windows using `TimePicker`. Overlapping windows on the same weekday are rejected client-side with a clear message before the database exclusion constraint fires.
- Exceptions: mark specific dates as unavailable, or add extra windows on a date, selected from the month grid.
- Service radius: a `Slider` in metres bound to `sitter_profiles.service_radius_meters`, displayed via `DistanceLabel` — this is the radius that determines which requests reach this sitter.
- The accepting-requests toggle, shared with the sitter dashboard header, so both reflect one value.
- A read-only preview showing the next fourteen days resolved from windows, exceptions and existing bookings, so the sitter can see the effect.
- Saving is explicit, with a dirty indicator and a discard confirmation on leaving with unsaved changes.
- All four states, and a `forbidden` case for a profile without the sitter role — which should be unreachable, since the tab only renders for sitters, but must not crash.

## Out of scope

The month grid (ticket 081) and the day agenda (ticket 082). Any schema change — if the exclusion constraint or exceptions table cannot express something, report on ticket 048. Automatic availability inference from bookings.

## Files you own

`src/screens/schedule/availability/**`.

## Files you must NOT touch

`src/screens/schedule/schedule-context.tsx`, `month-view/**` (ticket 081), `day-agenda/**` (ticket 082). `src/screens/dashboard-sitter/**` (ticket 075) — share the toggle through the port, not by editing that screen. Any route file or `routes.ts`.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts adding a window overlapping an existing one on the same weekday is rejected client-side with a message and issues zero write calls.
3. A test asserts a non-overlapping window saves and reads back through `SitterPort` with the same start and end times.
4. A test asserts marking a date as an exception makes it unavailable in the fourteen-day preview, and that a date with an `accepted` booking is unavailable regardless of windows.
5. A test asserts the radius control writes metres: the 20 km position persists `20000` and the label reads `20.0 km`.
6. A test asserts leaving with unsaved changes prompts a discard confirmation and that discarding restores the last saved state.
7. A test asserts toggling accepting-requests here and re-reading through `SitterPort` returns the new value, so the dashboard header reflects it.
8. A test asserts a parent-role profile reaching this component renders the forbidden state without throwing.

## Blocked by

- 040 Calendar / DateRangePicker and TimePicker
- 048 Schema: sitter profiles / services and availability
- 081 Screen: schedule — month calendar
