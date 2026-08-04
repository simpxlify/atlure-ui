---
id: "082"
title: "Screen: schedule — day agenda and booking detail"
repo: atlure-paw
epic: paw-screens
priority: P1
size: M
serialize: "No"
milestone: M5
blocked_by: "081 Screen: schedule — month calendar; 038 Dialog / AlertDialog and Toast"
labels: "epic:paw-screens; type:screen; flow:schedule"
---

# Screen: schedule — day agenda and booking detail

## Context

Second of three schedule tickets. In the prototype this is the `showDayDetails` panel that appears when a date is tapped in `ScheduleScreen.tsx`. It is the only place a booking's full detail and its status actions live, which makes it the sitter's accept/decline surface and the parent's cancel surface — the booking status transition graph is enforced server-side, so this screen must render only the transitions currently legal.

## Scope

- A day agenda panel driven by `selectedDate` from `ScheduleContext`, listing that day's bookings in time order with the counterparty avatar, pet, service kind, time window via `DurationLabel`, and status.
- Tapping a booking expands its full detail: both parties, pets, notes, agreed amount via `MoneyLabel` labelled as settled off-platform, and the status history.
- Status actions rendered from the legal transitions for the current status and role, calling the Hono `POST /bookings/:id/transition` route — never a direct table write. A sitter sees accept and decline on `requested`; a parent sees cancel; both see complete on `in-progress`.
- Destructive transitions go through `AlertDialog` with a reason field where the schema records one.
- Links out: message the counterparty, open the pet, and open live tracking when the booking is `in-progress`.
- Optimistic status update reverting on a failed `Result`, with a `conflict` result surfacing as "this booking changed, refreshing" and a refetch.
- An empty day renders a short note plus, for sitters, a shortcut to the availability tab.
- Subscribe to booking changes so a counterparty's action updates this panel live.

## Out of scope

The month grid (ticket 081) and the availability editor (ticket 083). Live tracking content (ticket 087). Leaving a review (ticket 089) — only link to it.

## Files you own

`src/screens/schedule/day-agenda/**`.

## Files you must NOT touch

`src/screens/schedule/schedule-context.tsx` and `month-view/**` (ticket 081) — consume the context as landed; if it lacks something, report on 081. `src/screens/schedule/availability/**` (ticket 083). Any route file, including `routes.ts` — ticket 081 already flipped this route.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts a `requested` booking shows accept and decline for the sitter role and neither for the parent role, and that a `completed` booking shows no transition actions at all.
3. A test asserts every status action calls the transition route and that `grep -rn "\.from(\"bookings\")\|from('bookings')" src/screens/schedule/day-agenda` prints nothing — no direct table writes.
4. A test asserts a failed transition reverts the optimistic status to its prior value.
5. A test asserts a `conflict` result triggers exactly one refetch and renders the changed-booking notice.
6. A test asserts a destructive transition is confirmed through `AlertDialog` and that the reason is included in the request body.
7. A test asserts a booking change delivered through `BookingPort.subscribeToBooking` updates the rendered status without a manual refresh.
8. A test asserts the live-tracking link appears only for `in-progress` bookings.

## Blocked by

- 038 Dialog / AlertDialog and Toast
- 081 Screen: schedule — month calendar
