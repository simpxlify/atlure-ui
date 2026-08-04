---
id: "074"
title: "Screen: pet-parent dashboard and quick actions"
repo: atlure-paw
epic: paw-screens
priority: P0
size: L
serialize: "No"
milestone: M4
blocked_by: "062 Auth gate: Supabase session / protected routes and role switching; 064 Mock adapter with latency and failure injection / plus one fixture file per entity; 039 Skeleton / Spinner / EmptyState / ErrorState and ListRow"
labels: "epic:paw-screens; type:screen; flow:dashboard"
---

# Screen: pet-parent dashboard and quick actions

## Context

References: `atlure-spec-reference/src/app/components/Dashboard.tsx` and `QuickActionsModal.tsx`. The parent home: a greeting header with the user's name and a notifications action, a services section leading to the two browse groups, a "Your Pets" section with an add-pet entry point, and a find-a-sitter action. The quick-actions sheet is a small overlay of shortcuts and is folded into this ticket since it has no route of its own. The prototype's `handleServiceGroup` maps a tap onto `walk-sit` or `home-boarding`.

## Scope

- Greeting header using the profile display name, with notification and quick-actions affordances; the notification affordance shows an unread count from `NotificationPort`.
- Services section with two cards routing to the two browse groups.
- Upcoming bookings strip: the next few `accepted` or `in-progress` bookings with dates via `DateRangeLabel` and a tap through to the booking detail.
- Your Pets: horizontal list of the parent's pets with a tap to the pet profile and an add-pet entry opening the add-pet route.
- Find a sitter primary action routing to search.
- Quick-actions sheet with shortcuts to notifications, schedule and settings. The prototype also had an "announcement" composer here; that is a sitter-side concept, so omit it from the parent dashboard and note the decision on the ticket.
- All four states per section independently — a failed pets fetch must not blank the whole screen. Empty pets renders an `EmptyState` inviting the first pet.
- Explore mode: a signed-out visitor sees the services and search entry points but the pets section prompts sign-up.
- Mount point for the coach-marks overlay from ticket 069 is already in the route file; do not add a second one.
- Flip this route's `status` to `live`.

## Out of scope

The sitter dashboard (ticket 075). Add-pet form (ticket 076). Pet profile (ticket 077). Notifications list (ticket 092). Coach-marks content (ticket 069).

## Files you own

The home route's parent branch, `src/screens/dashboard-parent/**`, one line of `src/navigation/routes.ts`.

## Files you must NOT touch

`src/screens/dashboard-sitter/**` (ticket 075). `src/components/coach-marks/**` (ticket 069). `src/data/fixtures/**`. Other route files.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts the greeting renders the profile display name from `AuthProvider`, not a hard-coded string; `grep -rn "Sarah" src/screens/dashboard-parent` prints nothing.
3. A test asserts the two service cards navigate to the walk-sit and home-boarding routes respectively.
4. A test asserts a failing pets fetch renders an inline error in the pets section only, while the services section still renders — asserted by the presence of both nodes.
5. A test asserts zero pets renders the empty state with an add-pet action that navigates to the add-pet route.
6. A test asserts the notification affordance renders the unread count returned by `NotificationPort` and hides the badge at zero.
7. A test in explore mode (no session) asserts the pets section shows a sign-up prompt and issues zero `PetPort` calls.
8. A test asserts the upcoming-bookings strip renders only `accepted` and `in-progress` bookings, using the seeded fixtures.

## Blocked by

- 039 Skeleton / Spinner / EmptyState / ErrorState and ListRow
- 062 Auth gate: Supabase session / protected routes and role switching
- 064 Mock adapter with latency and failure injection / plus one fixture file per entity
