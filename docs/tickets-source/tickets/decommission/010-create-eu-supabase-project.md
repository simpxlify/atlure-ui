---
id: "010"
title: Create the Supabase project in an EU region
repo: admin
epic: decommission
priority: P0
size: XS
serialize: "No"
milestone: M0
blocked_by: ""
labels: "epic:decommission; type:manual; blocked:waiting-on-external; needs:david; area:supabase"
---

# Create the Supabase project in an EU region

## Context

Atlure's backend is Supabase (Postgres + PostGIS + Auth + Storage + Realtime) plus a thin Hono service. The market is EU-wide and the product stores PII and sitter ID documents, so the project must be in `eu-central-1` or `eu-west-1`. **Region is fixed at creation and cannot be changed later** — getting this wrong means recreating the project and re-running every migration.

## Scope

**This ticket requires David. An agent cannot complete it.**

- Create a Supabase project named `atlure` in `eu-central-1` (or `eu-west-1`).
- Record the project ref, anon key, service-role key and DB password.
- Store `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` as GitHub Actions secrets on `simpxlify/atlure-api`.
- Enable the `postgis` extension.

## Out of scope

Any migration, RLS policy, bucket or seed data — those are epic `backend`.

## Files you own

None.

## Files you must NOT touch

Do not commit any key to any repo. Keys go in Actions secrets and in local `.env` files that ticket 003 ignores.

## Acceptance criteria

1. `supabase projects list` shows a project named `atlure` whose region string starts with `eu-`.
2. `psql "$SUPABASE_DB_URL" -c "select postgis_version();"` returns a version string.
3. `gh secret list --repo simpxlify/atlure-api` includes `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

## Blocked by

Nothing. This blocks all of M3.
