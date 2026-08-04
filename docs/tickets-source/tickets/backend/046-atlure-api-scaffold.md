---
id: "046"
title: Scaffold atlure-api with the Supabase CLI and a Hono skeleton
repo: atlure-api
epic: backend
priority: P0
size: M
serialize: "Yes"
milestone: M3
blocked_by: "010 Create the Supabase project in an EU region"
labels: "epic:backend; type:scaffold; serialize"
---

# Scaffold atlure-api with the Supabase CLI and a Hono skeleton

## Context

`atlure-api` holds every backend artifact as version-controlled SQL — migrations, RLS policies, PostGIS indexes, Realtime configuration, storage buckets and seed data — plus a thin Hono/TypeScript service for business logic that does not belong in RLS policies. It also re-exports generated DB types so all three consumer repos share one definition. The Supabase project already exists in an EU region; this ticket wires the repo to it.

## Scope

- `supabase init` producing `supabase/config.toml`, linked to the existing EU project ref via `supabase link`.
- Directory layout: `supabase/migrations/`, `supabase/seed.sql`, `supabase/tests/` (pgTAP), `src/` for the Hono service.
- Hono 4.13.0 skeleton with a `/health` route, structured logging, and a typed env parser that fails fast on a missing variable.
- `@supabase/supabase-js` 2.112.0 pinned. Front-load every dependency so later tickets do not touch the lockfile.
- A `db:types` script running `supabase gen types typescript` into `src/types/database.ts`, plus a re-export module that is the only thing consumers import.
- `.env.example` covering `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`, `PORT`.
- CI workflow: start a local Supabase stack, apply all migrations from scratch, run pgTAP tests, typecheck.
- `AGENTS.md`: migrations are append-only and never edited once merged; every table gets RLS enabled in the same migration that creates it; no service-role key in client-reachable code.

## Out of scope

Any table, policy, bucket or route beyond `/health`. Deploying the Hono service (ticket 056).

## Files you own

`supabase/config.toml`, `package.json`, `tsconfig.json`, `src/index.ts`, `src/env.ts`, `src/types/index.ts`, `.env.example`, `AGENTS.md`, `.github/workflows/ci.yml`.

## Files you must NOT touch

Nothing yet exists to conflict with, but do not create migrations — later tickets own `supabase/migrations/` and each creates its own timestamped file.

## Acceptance criteria

1. `supabase start` then `supabase db reset` exits 0 from a clean checkout.
2. `pnpm db:types` regenerates `src/types/database.ts` and `git diff --exit-code src/types/database.ts` exits 0.
3. `pnpm dev` then `curl -s localhost:$PORT/health` returns HTTP 200 with a JSON body containing `"ok":true`.
4. Unset `SUPABASE_URL` and confirm `pnpm dev` exits non-zero within 2 seconds naming the missing variable.
5. `gh run list --workflow ci.yml --limit 1 --json conclusion --jq '.[0].conclusion'` prints `success`.
6. `grep -c "append-only" AGENTS.md` is at least 1.

## Blocked by

- 010 Create the Supabase project in an EU region
