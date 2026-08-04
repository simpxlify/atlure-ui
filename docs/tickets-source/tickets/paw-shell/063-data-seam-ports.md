---
id: "063"
title: "Data seam: one port per aggregate / Result / cursors and realtime"
repo: atlure-paw
epic: paw-shell
priority: P0
size: L
serialize: "Yes"
milestone: M3
blocked_by: "058 Scaffold atlure-paw with expo-router and locked identifiers; 014 Build @atlure/types with the corrected domain model"
labels: "epic:paw-shell; type:architecture; serialize"
---

# Data seam: one port per aggregate / Result / cursors and realtime

## Context

Screens talk to **ports**, not to the Supabase client. Two rules make the seam worth having: no transport concept may leak into a port signature — no `PostgrestError`, no `PostgrestResponse`, no raw HTTP status — and realtime must be in the interface from day one, because messaging and live tracking are two of the 25 screens and retrofitting subscriptions later is a screen rewrite. Screen work can then start before the schema is final, against a mock.

## Scope

Define, as types only plus a provider, in `src/data/ports/`:

- One interface per aggregate: `ProfilePort`, `PetPort`, `SitterPort`, `RequestPort`, `BookingPort`, `MessagePort`, `ReviewPort`, `NotificationPort`, `TrackingPort`, `StoragePort`, `SupportPort`.
- Every method is `async` and returns `Result<T>` from `@atlure/types` with the closed `ErrorCode` union. No method throws for an expected failure.
- List methods take a cursor request `{ cursor?: string; limit: number }` and return `Page<T>`. No offset/page-number pagination anywhere.
- Realtime methods are explicit and return an unsubscribe function: `MessagePort.subscribeToConversation(id, handler): () => void`, `BookingPort.subscribeToBooking(...)`, `TrackingPort.subscribeToLocation(...)` and `TrackingPort.publishLocation(...)`.
- A `DataProvider` React context plus one hook per port (`useSitterPort()` and so on), so a screen never imports an adapter directly.
- Query-layer conventions: a thin wrapper over the ports for caching and invalidation keys, with the key scheme documented so screen tickets do not invent their own.
- An ESLint rule banning imports of `@supabase/supabase-js` anywhere under `app/` or `src/screens/` — the mechanical enforcement of the seam.

## Out of scope

Any implementation — the mock is ticket 064 and the Supabase adapter is ticket 065. Any screen.

## Files you own

`src/data/ports/**`, `src/data/provider.tsx`, `src/data/hooks/**`, `src/data/query-keys.ts`, the ESLint rule addition.

## Files you must NOT touch

`src/auth/**` (ticket 062). `app/**`. Any adapter directory.

## Acceptance criteria

1. `npx tsc --noEmit` exits 0.
2. `grep -rniE "postgrest|supabase|http|status code" src/data/ports` prints nothing — the seam is transport-free.
3. A type test asserts every method on every port returns `Promise<Result<...>>`, implemented by a mapped-type assertion that fails to compile if any method returns a bare value.
4. A type test asserts every list method's parameter type includes `cursor` and its return type is `Page<T>`; `grep -rn "offset\|pageNumber" src/data/ports` prints nothing.
5. A type test asserts each `subscribe*` method's return type is `() => void`.
6. Add `import { createClient } from "@supabase/supabase-js"` to a scratch file under `src/screens/`, run `pnpm lint`, and confirm it fails. Delete the file.

## Blocked by

- 014 Build @atlure/types with the corrected domain model
- 058 Scaffold atlure-paw with expo-router and locked identifiers
