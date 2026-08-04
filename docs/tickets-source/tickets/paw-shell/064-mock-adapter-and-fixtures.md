---
id: "064"
title: "Mock adapter with latency and failure injection / plus one fixture file per entity"
repo: atlure-paw
epic: paw-shell
priority: P0
size: L
serialize: "Yes"
milestone: M3
blocked_by: "063 Data seam: one port per aggregate / Result / cursors and realtime"
labels: "epic:paw-shell; type:architecture; area:fixtures; area:conflict-hotspot; serialize"
---

# Mock adapter with latency and failure injection / plus one fixture file per entity

## Context

The mock adapter is what lets 29 screen tickets start before the schema is final, and its configurable `latencyMs` and `failureRate` are what force loading and error states to be built in phase one rather than retrofitted — the prototype has neither. Fixtures are a conflict hotspot: **one file per entity is mandated**, because a single `fixtures.ts` would be rewritten by 29 parallel agents.

## Scope

- `src/data/mock/` implementing every port from ticket 063 against in-memory state.
- Configuration: global `latencyMs` (with jitter) and `failureRate`, overridable per port and per method, driven by env vars in development so a screen can be exercised at `failureRate: 1` without a code change.
- Realtime simulated: `subscribeToConversation` emits a scripted message after a delay; `subscribeToLocation` emits a moving path so live tracking is developable without a device walking outside.
- Cursor pagination genuinely implemented, including a stable sort and a cursor that survives insertions, so screens do not accidentally depend on the mock returning everything at once.
- Fixtures under `src/data/fixtures/`, **one file per entity**: `profiles.ts`, `pets.ts`, `sitters.ts`, `services.ts`, `requests.ts`, `bookings.ts`, `conversations.ts`, `messages.ts`, `reviews.ts`, `notifications.ts`, `help-articles.ts`, `support-tickets.ts`, `amenities.ts`. Fixed UUIDs mirroring `atlure-api/docs/fixtures.md` so mock and Supabase runs are comparable.
- A shared **conformance test suite** in `src/data/conformance/` written against the port interfaces and parameterised by adapter, so ticket 065 runs the identical suite against Supabase. This suite is the contract.
- The suite covers, per port: happy path, `not-found`, `forbidden`, a paging walk with no duplicates and no gaps, and realtime subscribe/unsubscribe with no events after unsubscribe.

## Out of scope

The Supabase adapter (ticket 065). Any screen. Editing `atlure-api` fixtures.

## Files you own

`src/data/mock/**`, `src/data/fixtures/**`, `src/data/conformance/**`.

## Files you must NOT touch

`src/data/ports/**` (ticket 063) — if a port signature is unimplementable, report it there. **Screen tickets must not edit any file under `src/data/fixtures/`; they add a new file for a new entity or request an addition on this ticket.** Do not create a combined `fixtures.ts`.

## Acceptance criteria

1. `pnpm test` exits 0 with the conformance suite green against the mock adapter.
2. `ls src/data/fixtures/*.ts | wc -l` is at least 13 and `test -f src/data/fixtures/fixtures.ts` fails — no combined file exists.
3. A conformance test asserts a full paging walk with `limit: 2` over a 7-item fixture returns all 7 exactly once, in a stable order, across 4 pages.
4. A test with `failureRate: 1` asserts every port method returns `{ ok: false }` with a code from the union and that none of them throws.
5. A test with `latencyMs: 200` asserts a call takes at least 200 ms, and a screen test asserts the loading state is observable during that window.
6. A test asserts `subscribeToLocation` emits at least 3 positions and that no further handler call occurs after the returned unsubscribe is invoked.
7. Every fixture UUID present in `atlure-api/docs/fixtures.md` also appears in `src/data/fixtures/`, asserted by a script comparing both lists.

## Blocked by

- 063 Data seam: one port per aggregate / Result / cursors and realtime
