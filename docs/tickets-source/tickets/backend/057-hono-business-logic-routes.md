---
id: "057"
title: "Hono business logic: matching / notification fan-out and scheduled jobs"
repo: atlure-api
epic: backend
priority: P1
size: L
serialize: "No"
milestone: M5
blocked_by: "056 Hono service: auth middleware / error envelope and deployment; 050 Schema: service requests / bookings and status transitions"
labels: "epic:backend; type:service; area:hono"
---

# Hono business logic: matching / notification fan-out and scheduled jobs

## Context

Some operations cannot be a single client-side insert: creating a booking must check availability and conflicts atomically, a new request must be fanned out to eligible sitters, and expiry must happen without a client present. These are the routes that justify a Hono service alongside Supabase.

## Scope

- `POST /bookings` — creates a booking transactionally: verifies the sitter offers the kind, is accepting requests, is available for the window, and holds no overlapping booking; then inserts and appends status history. Returns `conflict` when the window is taken.
- `POST /bookings/:id/transition` — the only write path for booking status, enforcing the transition graph and appending history with the acting profile.
- `POST /service-requests/:id/fanout` — finds sitters within radius offering the kind and accepting the species, and creates notification rows for each. Idempotent per request id so a retry does not double-notify.
- `POST /notifications/read` — bulk mark-as-read.
- A `notifications` table if ticket 050 did not create one; if it did, use it and say so on the ticket rather than adding a duplicate.
- Scheduled jobs, as pg_cron or a scheduled worker: expire `open` requests past their start time, transition `accepted` bookings to `in-progress` at their start and flag overdue `in-progress` bookings, and reveal reviews past the 14-day window.
- Every job is idempotent and safe to run twice; each records a run row with counts.

## Out of scope

Push notification delivery to devices (ticket 108) — this ticket only creates notification rows. Payments. Matching quality or ranking beyond distance and eligibility.

## Files you own

`src/routes/bookings.ts`, `src/routes/service-requests.ts`, `src/routes/notifications.ts`, `src/jobs/**`, plus one new timestamped migration if a `notifications` table or `pg_cron` schedule is needed.

## Files you must NOT touch

Any existing migration. `src/middleware/**` and `src/lib/**` (ticket 056) — consume them.

## Acceptance criteria

1. `pnpm test` exits 0.
2. A test asserts two concurrent `POST /bookings` requests for the same sitter and overlapping window result in exactly one `201` and one `409` with `code: "conflict"`, run against a real local Postgres so the constraint is exercised.
3. A test asserts `POST /bookings/:id/transition` from `completed` to `accepted` returns 409 with `code: "conflict"` and appends no history row.
4. A test asserts calling `fanout` twice for the same request id creates notifications exactly once, verified by row count.
5. A test asserts `fanout` notifies exactly the seeded sitters within radius who offer the kind, matched by fixed UUIDs from `docs/fixtures.md`, and no others.
6. A test runs each scheduled job twice against the same fixture state and asserts the second run changes zero rows.

## Blocked by

- 050 Schema: service requests / bookings and status transitions
- 056 Hono service: auth middleware / error envelope and deployment
