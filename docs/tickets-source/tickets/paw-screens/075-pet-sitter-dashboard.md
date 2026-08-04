---
id: "075"
title: "Screen: pet-sitter dashboard"
repo: atlure-paw
epic: paw-screens
priority: P0
size: L
serialize: "No"
milestone: M4
blocked_by: "062 Auth gate: Supabase session / protected routes and role switching; 064 Mock adapter with latency and failure injection / plus one fixture file per entity; 037 Tabs / SegmentedControl and ScreenHeader"
labels: "epic:paw-screens; type:screen; flow:dashboard"
---

# Screen: pet-sitter dashboard

## Context

Reference: `atlure-spec-reference/src/app/components/PetSitterDashboard.tsx` — at 22 KB it is the largest single screen in the prototype. It has a `viewMode` of `list` or `map`, an `activeTab` of `pets` or `homes` (pet requests versus home-sitting requests), a filter toggle, and three tap targets: a pet request, a home-sitting request, and a pet inside a home. It is the sitter-side home route, chosen by role in the same route file as the parent dashboard.

## Scope

- Header with the sitter's name, an availability toggle bound to `sitter_profiles.is_accepting_requests`, and notification and quick-actions affordances.
- `SegmentedControl` switching between pet requests and home-sitting requests, each an independently paged list from `RequestPort`.
- Request cards: pet or property image, `UrgencyBadge`, location and `DistanceLabel`, service kind, dates, and rate via `MoneyLabel` with the right unit.
- Tapping a pet request or a home-sitting request opens the request-detail route (ticket 080); tapping a pet inside a home-sitting card opens the pet profile. The prototype converted a `PetInHome` into a `Pet` with mock rating and distance to do this — pass the real pet id instead and let the pet profile fetch it.
- A `viewMode` toggle to the map, reusing the map wrapper from ticket 072 rather than the prototype's placeholder panel.
- Earnings or activity summary strip: counts of `accepted`, `in-progress` and `completed` bookings for the current period. No payment figures — there are no payments in v1, so show agreed amounts labelled as such.
- All four states per tab independently, and an empty state distinguishing "no open requests near you" (offering to widen the service radius) from "you are not accepting requests" (offering to toggle availability).
- Flip nothing extra: the home route is already live from ticket 074; add the sitter branch inside it.

## Out of scope

Request detail (ticket 080). The map screen itself (ticket 072). Availability editing beyond the accepting-requests toggle (ticket 083). Verification onboarding.

## Files you own

`src/screens/dashboard-sitter/**` and the sitter branch of the home route file.

## Files you must NOT touch

`src/screens/dashboard-parent/**` (ticket 074). `src/components/map/**` (ticket 072) — consume it. `src/data/fixtures/**`. `src/navigation/routes.ts` — ticket 074 already flipped the home route.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts the home route renders the sitter dashboard when `activeRole` is `pet-sitter` and the parent dashboard when it is `pet-parent`.
3. A test asserts switching the segmented control loads a separate paged list and that each maintains its own scroll and cursor.
4. A test asserts tapping a pet inside a home-sitting card navigates to the pet route with that pet's real id, and that no synthetic rating or distance is fabricated — `grep -rn "4.8\|0.2 mi" src/screens/dashboard-sitter` prints nothing.
5. A test asserts toggling availability calls `SitterPort` once and reflects an optimistic state that reverts on a failed `Result`.
6. A test asserts the "not accepting requests" empty state appears when availability is off, with an action that turns it back on.
7. A test asserts the summary strip labels amounts as agreed-off-platform and contains no payment or payout wording: `grep -rniE "pay now|payout|checkout" src/screens/dashboard-sitter` prints nothing.

## Blocked by

- 037 Tabs / SegmentedControl and ScreenHeader
- 062 Auth gate: Supabase session / protected routes and role switching
- 064 Mock adapter with latency and failure injection / plus one fixture file per entity
