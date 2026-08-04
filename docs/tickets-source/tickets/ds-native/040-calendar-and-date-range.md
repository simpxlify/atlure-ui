---
id: "040"
title: "Calendar / DateRangePicker and TimePicker"
repo: atlure-ui
epic: ds-native
priority: P1
size: M
serialize: "No"
milestone: M2
blocked_by: "035 Sheet primitive / Select and Picker; 032 MoneyLabel / DistanceLabel / DurationLabel and DateLabel"
labels: "epic:ds-native; type:component"
---

# Calendar / DateRangePicker and TimePicker

## Context

Booking is date-driven: the schedule screen shows a month grid, the booking-request flow needs a date range (`"Dec 15-17, 2024"` in the prototype) and a time-of-day selection, and sitter availability needs disabled dates. The prototype used a DOM calendar built on `react-day-picker`, which cannot run on native, so this is a from-scratch implementation and the largest single component in the design system.

## Scope

- `Calendar`: month grid, week starting per locale (Monday in most of the EU — derive from the locale, do not hard-code Sunday), `selected` single date, `disabledDates` predicate, `minDate`/`maxDate`, month navigation, and a `markers` prop rendering dots on dates with bookings.
- `DateRangePicker`: two-tap range selection with an in-progress highlight, a `minNights`/`maxNights` guard, and a rendered summary using `DateRangeLabel`.
- `TimePicker`: an hour/minute selection presented in a `Sheet`, honouring the locale's 12- vs 24-hour convention.
- All dates handled as ISO date strings (`YYYY-MM-DD`) at the boundary — no `Date` objects in props — so timezone drift cannot silently shift a booking by a day.
- Accessibility: each day is a button with an `accessibilityLabel` containing the full formatted date, and disabled days report `accessibilityState.disabled`.

## Out of scope

Recurring availability rules, timezone conversion between parent and sitter, and the schedule screen itself (tickets 081, 082, 083). Web calendar — the marketing site needs none.

## Files you own

`packages/ui/src/components/calendar.tsx`, `date-range-picker.tsx`, `time-picker.tsx`, `packages/ui/src/lib/date.ts`, `apps/storybook-web/stories/Calendar.stories.tsx`.

## Files you must NOT touch

`sheet.tsx` (ticket 035) — compose it. `date-label.tsx` (ticket 032) — compose it. `packages/ui/src/index.ts`.

## Acceptance criteria

1. `pnpm --filter @atlure/ui test` exits 0.
2. A test asserts the grid for `2026-03` under locale `de-DE` starts on Monday and under `en-US` starts on Sunday.
3. A test asserts no prop or callback accepts or emits a `Date` instance: `grep -n "new Date(" packages/ui/src/components/calendar.tsx` may appear only inside `lib/date.ts`, and a type test asserts `onSelect` receives a `string`.
4. A test asserts selecting `2026-03-14` then `2026-03-17` with `minNights={2}` yields the range, while `2026-03-14` then `2026-03-15` is rejected and leaves the range unchanged.
5. A test asserts a date excluded by `disabledDates` is not selectable and reports `accessibilityState.disabled`.
6. A test asserts a day cell's `accessibilityLabel` contains the localised full date string, not just the day number.

## Blocked by

- 032 MoneyLabel / DistanceLabel / DurationLabel and DateLabel
- 035 Sheet primitive / Select and Picker
