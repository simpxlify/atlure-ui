---
id: "081"
title: "Screen: schedule — month calendar"
repo: atlure-paw
epic: paw-screens
priority: P1
size: M
serialize: "No"
milestone: M5
blocked_by: "040 Calendar / DateRangePicker and TimePicker; 065 Supabase adapter passing the same conformance suite as the mock"
labels: "epic:paw-screens; type:screen; flow:schedule"
---

# Screen: schedule — month calendar

## Context

Reference: `atlure-spec-reference/src/app/components/ScheduleScreen.tsx` (16 KB) — a month grid with `currentDate`, `selectedDate` and a `showDayDetails` panel, hard-coded month and day names starting on Sunday. It is one of the three oversized screens and is split into three tickets: this one owns the month grid and its data loading; ticket 082 owns the day agenda; ticket 083 owns the sitter availability editor. This ticket lands first and defines the shared route shell.

## Scope

- The route shell and a `ScheduleContext` holding the visible month, the selected date and the loaded bookings, which tickets 082 and 083 consume. Define its interface fully here so the other two tickets do not need to change it.
- Month grid via the design-system `Calendar`, with markers on dates that have bookings, distinguishing `accepted`, `in-progress` and `completed` by marker style.
- Month navigation loading the visible month's bookings through `BookingPort`, with prefetch of the adjacent months.
- Locale-derived week start — not the prototype's hard-coded Sunday — and localised month and day names via `Intl`, not the prototype's hard-coded English arrays.
- Role awareness: a parent sees their bookings, a sitter sees theirs; the same screen with a different query.
- A segmented control switching between the calendar view and, for sitters, the availability editor tab whose content ticket 083 fills — land the tab here rendering a placeholder that 083 replaces.
- All four states: skeleton grid while loading, error with retry, and an empty month rendering the grid with a "nothing scheduled" note rather than an empty screen.
- Flip this route's `status` to `live`.

## Out of scope

The day agenda panel (ticket 082) — this ticket sets `selectedDate` and renders the slot 082 fills. The availability editor (ticket 083). Creating bookings (ticket 079).

## Files you own

The schedule route file, `src/screens/schedule/schedule-context.tsx`, `src/screens/schedule/month-view/**`, one line of `src/navigation/routes.ts`.

## Files you must NOT touch

`src/screens/schedule/day-agenda/**` (ticket 082) and `src/screens/schedule/availability/**` (ticket 083). `packages` in any repo. Other route files.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts the grid week start is Monday under `de-DE` and Sunday under `en-US`, and `grep -rn "'Sun'\|\"Sun\"\|monthNames" src/screens/schedule/month-view` prints nothing.
3. A test asserts navigating to the next month issues exactly one `BookingPort` query for that month plus prefetches, and does not refetch a month already loaded.
4. A test asserts a date with an `in-progress` booking renders a different marker than one with a `completed` booking.
5. A test asserts the parent role queries bookings by `parentId` and the sitter role by `sitterId`, by asserting the query argument.
6. A test asserts an empty month renders the grid plus the nothing-scheduled note, and `failureRate: 1` renders `ErrorState` with a working retry.
7. A test asserts `ScheduleContext` exposes `visibleMonth`, `selectedDate`, `setSelectedDate` and `bookingsByDate`, so tickets 082 and 083 need no change to it.

## Blocked by

- 040 Calendar / DateRangePicker and TimePicker
- 065 Supabase adapter passing the same conformance suite as the mock
