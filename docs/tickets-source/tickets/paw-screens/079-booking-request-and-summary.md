---
id: "079"
title: "Screen: booking request and confirmation summary"
repo: atlure-paw
epic: paw-screens
priority: P0
size: L
serialize: "No"
milestone: M4
blocked_by: "078 Screen: sitter public profile and service details; 057 Hono business logic: matching / notification fan-out and scheduled jobs; 040 Calendar / DateRangePicker and TimePicker"
labels: "epic:paw-screens; type:screen; flow:booking"
---

# Screen: booking request and confirmation summary

## Context

This replaces the prototype's `PaymentScreen.tsx`, which collects a card number, CVV, a payment method choice and shows a payment breakdown and a "Payment Successful!" state. **There are no payments in v1** — parents and sitters settle off-platform and Atlure takes no cut — so the screen becomes a booking request and confirmation summary. Its "Booking Summary" section is the part worth keeping. This is the final step of the M4 thin slice.

## Scope

- Summary of the request being made: sitter, pet or pets, service kind, date range via `DateRangeLabel`, duration, and the agreed amount via `MoneyLabel` presented as an amount to settle directly with the sitter.
- Pet selection when the parent has more than one pet, and a notes field for the sitter.
- A clearly worded notice that Atlure does not handle payment and that the parent and sitter arrange it between themselves. This wording is user-facing and legally relevant — keep it plain and do not imply Atlure holds funds.
- Submit calls the Hono `POST /bookings` route, which validates availability and conflicts atomically. A `conflict` result renders as "those dates were just taken" with a path back to the calendar, not as a generic error.
- Pending state disables submit and prevents double submission; the request is idempotent so a retry after a network timeout cannot create two bookings.
- Success state: confirmation with the booking reference, and actions to message the sitter or view the booking in the schedule.
- Flip this route's `status` to `live`. Note the route was named for payment in the prototype; keep whatever name ticket 059 landed and do **not** rename it here.

## Out of scope

Any payment field, card input, payment method selection, fee breakdown or payout. Do not add a placeholder for a future payment step. Sitter-side acceptance (ticket 080). The monetization decision (tickets 112, 113).

## Files you own

The booking-request route file, `src/screens/booking-request/**`, one line of `src/navigation/routes.ts`.

## Files you must NOT touch

`src/screens/sitter-profile/**` (ticket 078). `src/data/**`. Other route files. Do not rename any route file.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. `grep -rniE "card number|cvv|expiry|stripe|payment method|pay now" src/screens/booking-request` prints nothing.
3. A test asserts the off-platform settlement notice is rendered and contains no wording implying Atlure processes or holds payment.
4. A test asserts a `conflict` result renders the dates-taken message with an action returning to date selection, and that the generic `ErrorState` is not used for that case.
5. A test asserts double-pressing submit issues exactly one create call, using a deferred mock.
6. A test asserts a network timeout followed by a retry results in exactly one booking, verified by the mock adapter's booking count — proving the idempotency key is sent.
7. An integration test against local Supabase and the deployed Hono route creates a booking and asserts it is readable through `BookingPort` with status `requested`.
8. A test asserts the success state shows the booking reference and both follow-up actions navigate correctly.

## Blocked by

- 040 Calendar / DateRangePicker and TimePicker
- 057 Hono business logic: matching / notification fan-out and scheduled jobs
- 078 Screen: sitter public profile and service details
