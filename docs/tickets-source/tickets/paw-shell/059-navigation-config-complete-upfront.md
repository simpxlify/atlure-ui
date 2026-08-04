---
id: "059"
title: Land the full navigation tree upfront with every route coming-soon
repo: atlure-paw
epic: paw-shell
priority: P0
size: M
serialize: "Yes"
milestone: M2
blocked_by: "058 Scaffold atlure-paw with expo-router and locked identifiers; 037 Tabs / SegmentedControl and ScreenHeader"
labels: "epic:paw-shell; type:navigation; area:conflict-hotspot; serialize"
---

# Land the full navigation tree upfront with every route coming-soon

## Context

29 screen tickets run in parallel and would all edit the same navigation config. The mitigation is to land the **complete** tree now, with every route rendering a `ComingSoon` placeholder, so each screen ticket flips one word on one line and git merges cleanly. The authoritative source for the tree is the prototype's `App.tsx`: a 25-member screen union plus `handleBack`, `handleTabChange` and `handleProfileNavigation`, which together define every transition.

## Scope

- Translate the prototype's screen union into an expo-router file tree. Every union member gets a route file. Every file initially default-exports `<ComingSoon route="..." />`.
- Group layout: `(auth)` for login, signup, role-selection and onboarding; `(tabs)` for the five bottom-tab destinations (home, bookmarks, messages, schedule, profile); the rest as stack routes pushed above the tabs.
- The tab bar shows the same five tabs for both roles, with `home` and `profile` resolving to the role-appropriate screen — matching the prototype, where `BottomNavigation` receives `userRole` and `Dashboard` versus `PetSitterDashboard` is chosen inside the dashboard route.
- Reproduce `handleBack` exactly as router hierarchy rather than as a conditional chain: `pet-profile` and `find-sitter` return to the home tab; `sitter-profile` returns to whichever service browse screen it was reached from; the six profile sub-screens return to the profile tab. Encode the "return to the originating service screen" case with a route param, not global state.
- Deep links: `atlure://` and `https://www.atlure.com/...` mapped for sitter profiles and bookings, so the marketing site can link into the app.
- A `routes.ts` registry listing every route with a `status: "coming-soon" | "live"` field. **The one-word flip each screen ticket makes is in this file, one line each.**
- A test asserting every member of the prototype's screen union has a route, driven by a committed list, so no screen is silently missing.

## Out of scope

Any screen implementation. Auth redirects (ticket 062) — this ticket lays the `(auth)` group but not the gate.

## Files you own

`app/**` route files (placeholder bodies only), `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `src/navigation/routes.ts`, `src/components/coming-soon.tsx`.

## Files you must NOT touch

Nothing else in the repo. **After this ticket lands, no screen ticket may add, rename or move a route file, or edit any `_layout.tsx`** — a screen ticket replaces the body of exactly one route file and flips exactly one `status` value in `routes.ts`. Any screen needing a route change must say so on its ticket and have it landed here first.

## Acceptance criteria

1. `npx tsc --noEmit` exits 0 and the app launches to the login route.
2. A test asserts `routes.ts` contains an entry for all 25 prototype screen-union members, comparing against a committed list extracted from `atlure-spec-reference/src/app/App.tsx`; the test fails if any is missing.
3. A test asserts every entry in `routes.ts` has a corresponding file under `app/` and every file under `app/` has an entry — set equality in both directions.
4. A navigation test asserts back from `pet-profile` lands on the home tab, back from `sitter-profile` reached via `walk-sit-services` lands on `walk-sit-services`, and back from `security` lands on the profile tab.
5. A test asserts opening `atlure://sitter/<id>` and `https://www.atlure.com/sitters/<id>` both resolve to the sitter profile route with the id as a param.
6. At the end of this ticket every entry in `routes.ts` has `status: "coming-soon"` — asserted by a test, which later screen tickets will change one line at a time.

## Blocked by

- 037 Tabs / SegmentedControl and ScreenHeader
- 058 Scaffold atlure-paw with expo-router and locked identifiers
