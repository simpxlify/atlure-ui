---
id: "055"
title: "Seed data at known coordinates and the shared generated DB types"
repo: atlure-api
epic: backend
priority: P0
size: M
serialize: "No"
milestone: M3
blocked_by: "054 RLS policies across every table / with an adversarial verification suite"
labels: "epic:backend; type:test; area:fixtures"
---

# Seed data at known coordinates and the shared generated DB types

## Context

Geospatial assertions need sitters at exactly known coordinates, RLS assertions need at least two unrelated users plus a counterparty pair, and the port conformance suite needs the same entities present in both the mock and the Supabase adapter. All three consumer repos import the generated DB types from here, so the types must be a committed, reviewed artifact and not regenerated on the fly.

## Scope

- `supabase/seed.sql` creating deterministic fixtures with fixed UUIDs: three parents, four sitters, six pets, and sitters placed at 1 km, 4 km, 6 km, 18 km and 25 km from a reference point in Lisbon, Berlin and Amsterdam so multi-currency and multi-city cases are covered.
- Bookings in each status, a conversation with messages, and reviews in both the visible and not-yet-revealed states.
- Prices in EUR, GBP and PLN so multi-currency formatting is exercised end to end.
- `src/types/database.ts` committed, regenerated only via `pnpm db:types`, plus `src/types/index.ts` re-exporting the subset consumers may use.
- A CI step running `pnpm db:types` and failing if the committed file differs — the guard against schema drift between repos.
- A README table mapping each fixture UUID to what it represents, so screen and test tickets reference them by name.

## Out of scope

Mock fixtures for the app's mock adapter — those live in `atlure-paw`, one file per entity (ticket 064). Production data. Any real user data.

## Files you own

`supabase/seed.sql`, `src/types/database.ts`, `src/types/index.ts`, `docs/fixtures.md`, the `db:types` CI step.

## Files you must NOT touch

Any migration. `src/index.ts` or Hono routes.

## Acceptance criteria

1. `supabase db reset` applies migrations and the seed with exit 0.
2. `pnpm db:types && git diff --exit-code src/types/database.ts` exits 0.
3. A test asserts `search_sitters` from the Lisbon reference point at 5000 m returns exactly the two seeded sitters at 1 km and 4 km, matched by their fixed UUIDs.
4. A test asserts the seed contains at least one booking in each of the eight booking statuses, by grouping and comparing against the enum's members.
5. A test asserts at least three distinct `rate_currency` values exist in `sitter_services`.
6. Every UUID in `docs/fixtures.md` exists in the database after a reset, asserted by a script that parses the doc and queries each id.

## Blocked by

- 054 RLS policies across every table / with an adversarial verification suite
