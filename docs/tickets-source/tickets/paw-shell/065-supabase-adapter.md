---
id: "065"
title: "Supabase adapter passing the same conformance suite as the mock"
repo: atlure-paw
epic: paw-shell
priority: P0
size: L
serialize: "Yes"
milestone: M3
blocked_by: "064 Mock adapter with latency and failure injection / plus one fixture file per entity; 062 Auth gate: Supabase session / protected routes and role switching; 055 Seed data at known coordinates and the shared generated DB types"
labels: "epic:paw-shell; type:architecture; serialize"
---

# Supabase adapter passing the same conformance suite as the mock

## Context

The seam is only real if the same test suite passes against both adapters. This ticket implements every port against Supabase and runs the **identical** conformance suite from ticket 064 — same file, different adapter injection. It is also where transport errors are translated into the closed `ErrorCode` union, which is the single place `PostgrestError` is allowed to be mentioned in the whole app.

## Scope

- `src/data/supabase/` implementing every port from ticket 063 using `@supabase/supabase-js` and the generated types re-exported by `atlure-api`.
- `SitterPort.search` calls the `search_sitters` RPC with metres, mapping `distance_meters` straight through — no client-side distance maths.
- Cursor pagination implemented as keyset queries matching the RPC's cursor contract, not `range()` offsets.
- Realtime: `MessagePort` subscribes to Postgres Changes on `messages` filtered by conversation; `TrackingPort` uses Realtime **broadcast** on `booking:<id>:tracking` per `atlure-api/docs/realtime-channels.md`; both return working unsubscribe functions and reconnect after a network drop.
- Storage: `StoragePort` uploads through the buckets from ticket 053, using signed URLs for the private buckets and public URLs for the rest.
- A single `mapError` module translating `PostgrestError`, auth errors, storage errors and network failures onto `ErrorCode`. Unknown shapes map to `unknown` and are logged.
- Adapter selection by env var, defaulting to Supabase in release builds and mock in the dev client, so a screen can be run either way.

## Out of scope

Changing any port signature (ticket 063) or the conformance suite (ticket 064) — if a Supabase constraint makes a port method impossible, report on 063 rather than weakening the suite. Any schema change.

## Files you own

`src/data/supabase/**`, `src/data/map-error.ts`, adapter selection in `src/data/provider.tsx`.

## Files you must NOT touch

`src/data/ports/**`, `src/data/conformance/**`, `src/data/fixtures/**`. `app/**`. `atlure-api/**`.

## Acceptance criteria

1. `pnpm test:conformance --adapter=supabase` runs the same suite as `--adapter=mock` and both exit 0, against a locally reset and seeded Supabase.
2. A test asserts the suite file paths used by both runs are identical, so the suite cannot have been forked.
3. `grep -rln "PostgrestError" src` returns exactly one path: `src/data/map-error.ts`.
4. A test asserts `SitterPort.search` with `radiusMeters: 5000` from the Lisbon fixture point returns exactly the two seeded sitter UUIDs at 1 km and 4 km, matching the assertion in ticket 055.
5. A test asserts a paging walk over seeded messages with `limit: 10` returns every message exactly once with no gaps, and that `grep -rn "\.range(" src/data/supabase` prints nothing.
6. An integration test asserts a second client's message arrives through `subscribeToConversation` within 2 seconds, and that killing and restoring the socket resumes delivery without a manual resubscribe.
7. A test asserts a `select` blocked by RLS surfaces as `{ ok: false, code: "forbidden" }` or an empty `Page`, never as a thrown error or a raw Postgres message.

## Blocked by

- 055 Seed data at known coordinates and the shared generated DB types
- 062 Auth gate: Supabase session / protected routes and role switching
- 064 Mock adapter with latency and failure injection / plus one fixture file per entity
