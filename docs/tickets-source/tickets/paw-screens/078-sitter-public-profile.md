---
id: "078"
title: "Screen: sitter public profile and service details"
repo: atlure-paw
epic: paw-screens
priority: P0
size: L
serialize: "No"
milestone: M4
blocked_by: "071 Screen: find a sitter — search / results / paging and states; 040 Calendar / DateRangePicker and TimePicker; 030 Badge / Chip / UrgencyBadge and StarRating"
labels: "epic:paw-screens; type:screen; flow:booking"
---

# Screen: sitter public profile and service details

## Context

Reference: `atlure-spec-reference/src/app/components/PetSitterProfilePetServiceDetails.tsx` (21 KB) with overlap from `PetServiceDetails.tsx`. It holds a photo carousel, an about section, services offered, specialties, this week's availability, certifications and verification, plus three dialogs — a calendar, a full calendar and a request composer with selected dates, time slots and a custom message. It is the last step before a booking request and the fifth step of the M4 thin slice. It must render for signed-out visitors too, since the marketing site links to sitter profiles.

## Scope

- Header photo carousel, name, `StarRating` with review count, verification badge, response time, and `DistanceLabel` when a search origin is known.
- About, specialties, accepted species, and amenities for home-boarding sitters.
- Services offered: one row per `sitter_services` entry with kind, rate via `MoneyLabel` and the correct `per` unit.
- This week's availability strip derived from `sitter_availability` plus exceptions and existing bookings, with a link opening the full `Calendar` in a sheet.
- Reviews section: the visible reviews for this sitter, cursor-paged, with an aggregate rating from `profile_rating_aggregates`.
- Certifications and verification status, showing only the status — never a document or a link to one.
- Primary action: request a booking, routing to the booking request flow with the sitter id, the selected service kind and any preselected dates.
- Secondary actions: message (routes to a conversation, creating one if needed) and bookmark toggle.
- Signed-out: everything renders, and both write actions route to sign-in and return here.
- All four states, including `not-found` for a stale link.
- Flip this route's `status` to `live`.

## Out of scope

The booking request flow and its confirmation (ticket 079). Leaving a review (ticket 089). Messaging screens (tickets 084-086) — you only navigate to them. Any verification document display.

## Files you own

The sitter route file, `src/screens/sitter-profile/**`, one line of `src/navigation/routes.ts`.

## Files you must NOT touch

`src/screens/booking-request/**` (ticket 079). `src/screens/search/**`. `src/data/fixtures/**`. Other route files.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts each service row renders its own currency: a fixture sitter with a EUR and a GBP service shows both symbols.
3. A test asserts the availability strip marks a day covered by an `accepted` booking as unavailable, using the seeded fixtures.
4. A test asserts the request action navigates with the sitter id, the chosen kind and the selected date range as params.
5. A test in signed-out mode asserts the profile renders fully and that pressing message routes to login and returns to this same sitter route afterwards.
6. A test asserts the verification section renders a status only: `grep -rniE "document|passport|id-card|storage" src/screens/sitter-profile` finds no document rendering or storage access.
7. A test asserts reviews page on scroll with no duplicate ids across two pages, and that a sitter with zero visible reviews renders an empty-reviews state rather than a zero rating.
8. A test asserts a `not-found` sitter id renders the not-found state.

## Blocked by

- 030 Badge / Chip / UrgencyBadge and StarRating
- 040 Calendar / DateRangePicker and TimePicker
- 071 Screen: find a sitter — search / results / paging and states
