---
id: "087"
title: "Screen: live tracking"
repo: atlure-paw
epic: paw-screens
priority: P1
size: L
serialize: "No"
milestone: M5
blocked_by: "051 Schema and Realtime: conversations / messages and live tracking channels; 065 Supabase adapter passing the same conformance suite as the mock; 072 Screen: map"
labels: "epic:paw-screens; type:screen; flow:tracking; area:realtime"
---

# Screen: live tracking

## Context

Reference: `atlure-spec-reference/src/app/components/LiveTrackingScreen.tsx` — an `isLive` flag, a static map, a sitter card and a scripted `LiveUpdate` feed. The real screen has two sides: the sitter publishes location over Realtime **broadcast** while a booking is `in-progress`, and the parent subscribes. Live ticks are not written to a table; only a decimated path (one point per 30 seconds) is persisted for the post-walk summary. Channel naming and authorisation follow `atlure-api/docs/realtime-channels.md`.

## Scope

- Parent view: map with the sitter's current position and the path so far, elapsed time via `DurationLabel`, distance covered via `DistanceLabel`, the sitter card with a message action, and the activity feed.
- Sitter view: a start/stop tracking control, foreground location updates via `expo-location`, publishing to `booking:<id>:tracking` at a sensible interval, and a visible indicator that tracking is on.
- Location permission handling as a first-class state, including the "while in use" versus "always" distinction and a clear explanation of why it is needed. A denied permission must not silently produce a dead screen.
- Battery consideration: throttle publish frequency and stop publishing when the booking leaves `in-progress`.
- Persist the decimated path so the parent can view the completed route after the walk; the screen renders the persisted path when the session has ended, with a clear "completed" state rather than a stale live view.
- Stale-data handling: if no broadcast arrives for 60 seconds, show a "last seen" timestamp instead of implying the position is current.
- Activity feed entries from booking status changes and sitter-posted notes.
- All four states plus a `forbidden` case for a non-participant opening the route by deep link.
- Flip this route's `status` to `live`.

## Out of scope

Background location tracking — explicitly deferred; it needs additional store justification and permission review. Note the limitation on the ticket. Geofencing or route optimisation. Emergency actions (ticket 088).

## Files you own

The live-tracking route file, `src/screens/live-tracking/**`, one line of `src/navigation/routes.ts`.

## Files you must NOT touch

`src/components/map/**` (ticket 072) — consume it; if it needs a prop, report on 072. `src/data/**`. Other route files.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts the parent view renders positions delivered through `TrackingPort.subscribeToLocation` and that unmounting unsubscribes.
3. A test asserts the sitter view calls `publishLocation` on the throttled interval and stops entirely once the booking status leaves `in-progress`.
4. A test asserts no live position is written to a table: `grep -rn "publishLocation" src/screens/live-tracking` shows broadcast use only, and the mock adapter records zero row inserts per tick.
5. A test asserts the persisted path is decimated to at most one point per 30 seconds over a simulated 10-minute session.
6. A test with fake timers asserts that 60 seconds without a broadcast switches the display to a last-seen timestamp.
7. A test asserts a denied location permission renders the permission state with a path to settings and zero publish calls.
8. A test asserts a non-participant opening the route renders the forbidden state without throwing.
9. A test asserts an ended session renders the completed state with the persisted path and no live indicator.

## Blocked by

- 051 Schema and Realtime: conversations / messages and live tracking channels
- 065 Supabase adapter passing the same conformance suite as the mock
- 072 Screen: map
