---
id: "080"
title: "Screens: pet request detail and home sitting request detail"
repo: atlure-paw
epic: paw-screens
priority: P1
size: L
serialize: "No"
milestone: M5
blocked_by: "075 Screen: pet-sitter dashboard; 038 Dialog / AlertDialog and Toast; 057 Hono business logic: matching / notification fan-out and scheduled jobs"
labels: "epic:paw-screens; type:screen; flow:booking"
---

# Screens: pet request detail and home sitting request detail

## Context

References: `atlure-spec-reference/src/app/components/PetRequestDetail.tsx` (19 KB) and `HomeSittingRequestDetail.tsx` (16 KB). Structurally the same screen: request header, service details, subject details (the pet, or the home and the pets in it), owner card, and an apply dialog with a message. They share one ticket and one implementation with a variant for the subject section, because duplicating 19 KB twice is how the prototype ended up with two near-identical files.

## Scope

- One `RequestDetailScreen` with a `kind` variant, rendered by both route files.
- Header: subject image, `UrgencyBadge`, service kind, dates via `DateRangeLabel`, duration, location and `DistanceLabel`, offered amount via `MoneyLabel`.
- Pet variant: pet details, care requirements, and medical notes only if policy allows at this stage — for an open request the sitter has no booking yet, so medical notes must be withheld with an explanation.
- Home variant: home type, amenities, and the list of pets in the home, each tapping through to the pet route.
- Owner card: avatar, display name, rating, response time, and a message action.
- Apply flow: a dialog with a message, submitting an application. Prevent double application and show the applied state on return.
- Withdraw an application behind an `AlertDialog`.
- States: loading, error with retry, and a `not-found` or `expired` state for a request that closed while the sitter was reading it — this is common and must be handled explicitly.
- Flip both route entries' `status` to `live` — two lines.

## Out of scope

The sitter dashboard lists (ticket 075). Messaging (tickets 084-086). Parent-side acceptance of an application — if no screen covers that, note it on the ticket as a gap rather than inventing one here.

## Files you own

Both request-detail route files, `src/screens/request-detail/**`, two lines of `src/navigation/routes.ts`.

## Files you must NOT touch

`src/screens/dashboard-sitter/**` (ticket 075). `src/screens/pet-profile/**` (ticket 077). `src/data/fixtures/**`. Other route files.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts both routes render the same component with different `kind` props, and `ls src/screens/request-detail` shows a single screen implementation with one subject-section component per variant.
3. A test asserts the pet variant renders the medical-notes withheld explanation and issues zero medical-notes fetches for an open request.
4. A test asserts the home variant lists every pet in the home and that tapping one navigates to the pet route with its real id.
5. A test asserts applying twice issues exactly one application call and that the applied state renders on return.
6. A test asserts withdraw is confirmed through `AlertDialog` before any call.
7. A test asserts a request whose status became `matched` renders the expired state with a path back to the dashboard, not a generic error.
8. `git diff --stat src/navigation/routes.ts` shows exactly two changed lines.

## Blocked by

- 038 Dialog / AlertDialog and Toast
- 057 Hono business logic: matching / notification fan-out and scheduled jobs
- 075 Screen: pet-sitter dashboard
