---
id: "056"
title: "Hono service: auth middleware / error envelope and deployment"
repo: atlure-api
epic: backend
priority: P1
size: M
serialize: "No"
milestone: M4
blocked_by: "046 Scaffold atlure-api with the Supabase CLI and a Hono skeleton; 054 RLS policies across every table / with an adversarial verification suite"
labels: "epic:backend; type:service; area:hono"
---

# Hono service: auth middleware / error envelope and deployment

## Context

The Hono service exists so business logic is not all encoded in RLS policies — matching, notification fan-out, scheduled jobs and, later, payment webhooks. Clients read and write most data through Supabase directly; Hono handles only what needs privileged or multi-step logic. Its error envelope must match the `Result` shape and closed `ErrorCode` union in `@atlure/types`, because no transport concept may leak through the data seam into screens.

## Scope

- Auth middleware verifying the Supabase JWT from the `Authorization` header, populating a typed `profileId` and `activeRole` on the context, rejecting with the `unauthenticated` code otherwise.
- A role guard helper so a route can require `pet-sitter`.
- Two Supabase clients: an anon-key client used with the caller's JWT for anything RLS can express, and a service-role client used only in code paths that provably need it, in a single module that logs every service-role use.
- A uniform error envelope mapping thrown errors onto the `ErrorCode` union from `@atlure/types`; unknown errors become `unknown` and are logged with a request id, never returned raw.
- Zod request validation on every route with `validation` errors reporting field paths.
- Rate limiting per profile id on write routes.
- Structured JSON logging with a request id, plus a `/health` and `/ready` split.
- Deployment: containerised, deployed to a EU region, with the service-role key injected as a secret. Document the chosen host in the repo README.
- OpenAPI generated from the Zod schemas and served at `/openapi.json`.

## Out of scope

The business-logic routes themselves (ticket 057). Payment webhooks — no payments in v1. Any client-side code.

## Files you own

`src/middleware/**`, `src/lib/supabase.ts`, `src/lib/errors.ts`, `src/lib/logger.ts`, `src/app.ts`, `Dockerfile`, `.github/workflows/deploy.yml`, README deployment section.

## Files you must NOT touch

`supabase/migrations/**`. `src/types/database.ts` (ticket 055) — import it, do not regenerate it here.

## Acceptance criteria

1. `pnpm test` exits 0.
2. A request with no `Authorization` header to a guarded route returns HTTP 401 with a body whose `code` is exactly `unauthenticated`.
3. A request with a valid parent JWT to a sitter-only route returns 403 with `code` exactly `forbidden`.
4. A test asserts a thrown unexpected error returns `code: "unknown"` and that the response body contains no stack trace and no Postgres error text, verified by asserting the body does not match `/PostgrestError|pg_|stack/`.
5. A test asserts every value of `ErrorCode` from `@atlure/types` is produced by at least one mapped case, by iterating the union.
6. `grep -rn "SERVICE_ROLE" src --include=*.ts` shows references only inside `src/lib/supabase.ts`.
7. `curl -s https://<deployed-host>/health` returns 200 and `curl -s https://<deployed-host>/openapi.json | jq -e '.paths' ` exits 0.

## Blocked by

- 046 Scaffold atlure-api with the Supabase CLI and a Hono skeleton
- 054 RLS policies across every table / with an adversarial verification suite
