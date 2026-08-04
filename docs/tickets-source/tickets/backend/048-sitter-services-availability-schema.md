---
id: "048"
title: "Schema: sitter profiles / services and availability"
repo: atlure-api
epic: backend
priority: P0
size: M
serialize: "Yes"
milestone: M3
blocked_by: "047 Schema: profiles / role switching and pets"
labels: "epic:backend; type:schema; serialize"
---

# Schema: sitter profiles / services and availability

## Context

Sitters offer four service kinds — dog walking, pet sitting, home boarding and home sitting — each with its own rate, and the prototype groups them into two browse screens (`WalkSitServices` and `HomeBoardingServices`). Rates must carry currency because the market is EU-wide, so a rate is an integer minor-unit amount plus a currency code, never a bare number as in the prototype's `rate: 120`.

## Scope

One migration creating:

- `sitter_profiles`: `profile_id` primary key referencing `profiles`, `headline`, `about`, `years_experience`, `response_time_minutes`, `is_accepting_requests`, `verification_status` enum (`unverified`,`pending`,`verified`,`rejected`), `service_radius_meters`, timestamps.
- `sitter_services`: `id`, `sitter_id`, `kind` enum (`dog-walking`,`pet-sitting`,`home-boarding`,`home-sitting`), `rate_amount` integer minor units, `rate_currency` char(3), `rate_unit` enum (`per-hour`,`per-day`,`per-night`,`per-walk`), `is_active`. Unique on `(sitter_id, kind)`.
- A check constraint that `rate_amount > 0` and `rate_currency` matches `^[A-Z]{3}$`.
- `sitter_accepted_species` linking a sitter to the species they accept.
- `sitter_availability`: recurring weekly windows as `(sitter_id, weekday, start_time, end_time)` plus `sitter_availability_exceptions` for specific blocked or extra dates. An exclusion constraint preventing overlapping windows on the same weekday.
- `sitter_amenities` for home-boarding listings (the prototype's `amenities: string[]`), as a join table against an `amenities` lookup, not a text array, so the marketing site can filter on it.
- RLS enabled on every table; policies deferred to ticket 054.
- pgTAP tests for every constraint.

## Out of scope

Geography columns and radius search (ticket 049). Bookings (ticket 050). Verification document upload (ticket 053). Policies (ticket 054).

## Files you own

One new timestamped migration and one new pgTAP test file.

## Files you must NOT touch

Any existing migration. The migration from ticket 047 in particular — add new tables in your own file even if they logically extend `profiles`.

## Acceptance criteria

1. `supabase db reset` exits 0.
2. `supabase test db` passes with assertions that all six tables exist with RLS enabled.
3. A pgTAP test asserts inserting a `sitter_services` row with `rate_amount = 0` raises a check violation, and `rate_currency = 'eur'` (lowercase) also raises.
4. A pgTAP test asserts a second `sitter_services` row with the same `(sitter_id, kind)` raises a unique violation.
5. A pgTAP test asserts two overlapping `sitter_availability` windows on the same weekday for the same sitter raise an exclusion-constraint violation.
6. `pnpm db:types && git diff --exit-code src/types/database.ts` exits 0 after committing.

## Blocked by

- 047 Schema: profiles / role switching and pets
