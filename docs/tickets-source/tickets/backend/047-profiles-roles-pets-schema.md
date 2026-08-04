---
id: "047"
title: "Schema: profiles / role switching and pets"
repo: atlure-api
epic: backend
priority: P0
size: M
serialize: "Yes"
milestone: M3
blocked_by: "046 Scaffold atlure-api with the Supabase CLI and a Hono skeleton"
labels: "epic:backend; type:schema; serialize"
---

# Schema: profiles / role switching and pets

## Context

Atlure uses **one account switchable between pet-parent and pet-sitter** — the prototype's `handleRoleSwitch` sets the active role without signing out, so a role is a capability on a profile, not a separate account type. Pets belong to a parent profile. The prototype typed `age` as a string like `"3 years"`, which cannot be sorted or aged; the schema stores `birth_date` instead.

## Scope

One migration creating:

- `profiles`: `id` referencing `auth.users`, `display_name`, `avatar_url`, `bio`, `phone`, `locale`, `preferred_currency`, `city`, `country_code`, `created_at`, `updated_at`. A trigger inserting a row on `auth.users` insert.
- `profile_roles`: `(profile_id, role)` with `role` a Postgres enum `('pet-parent','pet-sitter')`, unique per pair — a profile may hold both.
- `profiles.active_role` recording the role the user last switched to, constrained to a role they actually hold.
- `pets`: `id`, `owner_id`, `name`, `species` enum, `breed` nullable, `birth_date` date nullable, `weight_grams` integer nullable, `photo_url`, `notes`, `is_active`, timestamps.
- `pet_medical_notes` for vet contact, allergies and medications, separate from `pets` because it is more sensitive and gets a stricter policy.
- `updated_at` triggers on every table.
- RLS **enabled** on every table in the same migration, with policies deferred to ticket 054 — enabling without policies fails closed, which is the safe default.
- pgTAP tests asserting each table, enum, constraint and trigger exists.

## Out of scope

Sitter-specific tables (ticket 048). Any policy body (ticket 054). Seed data (ticket 055). ID document storage (ticket 053).

## Files you own

One new file under `supabase/migrations/` and one under `supabase/tests/`. Choose a timestamp later than every existing migration.

## Files you must NOT touch

Any existing migration — migrations are append-only. `supabase/config.toml`. `supabase/seed.sql`.

## Acceptance criteria

1. `supabase db reset` applies all migrations from scratch with exit 0.
2. `supabase test db` passes, including assertions that `profiles`, `profile_roles`, `pets` and `pet_medical_notes` exist and that `relrowsecurity` is true for all four.
3. A pgTAP test asserts inserting a `profiles.active_role` the profile does not hold in `profile_roles` raises an error.
4. A pgTAP test asserts a new `auth.users` row produces exactly one `profiles` row.
5. A pgTAP test asserts `pets.birth_date` is of type `date` and that no column named `age` exists on `pets`.
6. `pnpm db:types && git diff --exit-code src/types/database.ts` exits 0 after committing the regenerated types.

## Blocked by

- 046 Scaffold atlure-api with the Supabase CLI and a Hono skeleton
