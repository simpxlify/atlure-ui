---
id: "054"
title: "RLS policies across every table / with an adversarial verification suite"
repo: atlure-api
epic: backend
priority: P0
size: L
serialize: "Yes"
milestone: M3
blocked_by: "047 Schema: profiles / role switching and pets; 048 Schema: sitter profiles / services and availability; 050 Schema: service requests / bookings and status transitions; 051 Schema and Realtime: conversations / messages and live tracking channels; 052 Schema: reviews / ratings and aggregate rollups"
labels: "epic:backend; type:schema; area:security; serialize"
---

# RLS policies across every table / with an adversarial verification suite

## Context

Every schema ticket enables RLS without policies, which fails closed — nothing is readable until this ticket lands. The web marketing site reads Supabase directly with the anon key, so public-read policies for indexable sitter profiles are part of the attack surface and must be scoped to exactly the columns intended for indexing. RLS is verified adversarially: query another user's rows with **their real session** and assert empty results, not by reading the policy and believing it.

## Scope

For every table created in tickets 047, 048, 050, 051 and 052, write explicit `select`, `insert`, `update` and `delete` policies:

- `profiles`: self full access; other authenticated users read a limited public column set; anon reads only profiles that hold the `pet-sitter` role and are `verified`, and only public columns.
- `pets` and `pet_medical_notes`: owner only, plus read access for a sitter with an `accepted` or `in-progress` booking covering that pet — medical notes are the reason a sitter needs it at all.
- `sitter_profiles`, `sitter_services`, `sitter_availability`: owner writes; authenticated read; anon read restricted to `verified` sitters.
- `service_requests`: parent owns; sitters read `open` requests within their service radius.
- `bookings`: the two participants only, in both directions.
- `messages` and `conversations`: participants only, with `deleted_at` rows hidden.
- `reviews`: read when `is_visible`, or always by the author and subject; write only by the author.
- A pgTAP or integration matrix test: for each table, for each of `anon`, `owner`, `other-authenticated`, `counterparty`, assert the exact expected row visibility.
- A CI assertion that no table in the public schema has RLS disabled and no table has zero policies.

## Out of scope

Storage policies (ticket 053). Any new table or column — if a policy is impossible to express with the current schema, report it against the owning schema ticket rather than altering the table here.

## Files you own

One new timestamped migration containing only policies, plus `supabase/tests/rls_matrix.test.sql` and `src/tests/rls-integration.test.ts`.

## Files you must NOT touch

Any existing migration. Do not add or alter columns.

## Acceptance criteria

1. `supabase db reset` exits 0 and `supabase test db` passes.
2. A CI check asserts `select count(*) from pg_tables t where schemaname='public' and not exists (select 1 from pg_policies p where p.tablename=t.tablename)` returns 0.
3. An integration test with user B's real session selects user A's `pets` and asserts the result array length is exactly 0 — not an error, an empty result.
4. An integration test asserts an anon client selecting `profiles` returns only verified sitters, and that the returned objects contain no `phone` key.
5. An integration test asserts a sitter with an `accepted` booking can read the covered pet's `pet_medical_notes`, and that the same sitter cannot after the booking is `completed` and 30 days pass.
6. An integration test asserts user B cannot `update` a booking they are not a participant of, receiving 0 affected rows or a 403.
7. An integration test asserts a Realtime subscription by a non-participant receives no `messages` events for a conversation they are not in.

## Blocked by

- 047 Schema: profiles / role switching and pets
- 048 Schema: sitter profiles / services and availability
- 050 Schema: service requests / bookings and status transitions
- 051 Schema and Realtime: conversations / messages and live tracking channels
- 052 Schema: reviews / ratings and aggregate rollups
