---
id: "092"
title: "Screen: notifications"
repo: atlure-paw
epic: paw-screens
priority: P1
size: M
serialize: "No"
milestone: M5
blocked_by: "057 Hono business logic: matching / notification fan-out and scheduled jobs; 039 Skeleton / Spinner / EmptyState / ErrorState and ListRow"
labels: "epic:paw-screens; type:screen; flow:profile"
---

# Screen: notifications

## Context

Reference: `atlure-spec-reference/src/app/components/NotificationsScreen.tsx` — a role-aware list of notification items. Rows are created server-side by the fan-out route and the scheduled jobs (ticket 057), so this screen is a reader plus a mark-read writer. Its unread count is the same number the dashboard header and the tab badge show, so it must come from one source.

## Scope

- Cursor-paged list from `NotificationPort`, newest first, grouped by day with `DateLabel` relative timestamps.
- Row rendering per notification kind: booking requested, accepted, declined, cancelled, starting soon, completed, new message, new request near you, review received, review revealed. Each row has an icon, a one-line summary and a deep link to the relevant screen.
- Unknown or future notification kinds render a generic row rather than crashing — the server may ship a new kind before the app updates, and an exhaustive switch would break the screen.
- Mark a single row read on open, and a mark-all-read action.
- Role awareness: the sitter and parent see different kinds, matching the prototype's `userRole` prop.
- Unread count exposed from one module shared with the tab badge and dashboard header.
- Notification preferences: if ticket 090 placed them in security settings, link there and do not duplicate them; if not, own them here. State which on the ticket.
- All four states: skeleton rows, error with retry, and an empty state explaining that notifications appear as bookings and messages arrive.
- Flip this route's `status` to `live`.

## Out of scope

Push delivery, device token registration and permission prompting (ticket 108) — this screen is the in-app inbox only. Creating notifications (ticket 057).

## Files you own

The notifications route file, `src/screens/notifications/**`, one line of `src/navigation/routes.ts`.

## Files you must NOT touch

`src/messaging/unread.ts` (ticket 084) if it exists — read it, and add a notifications counterpart in your own module rather than editing it. `src/screens/settings/**` (ticket 090). Other route files.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts each known notification kind renders its own summary and deep-links to the expected route with the expected params.
3. A test asserts an unrecognised `kind` value renders the generic row and does not throw — there is no exhaustive switch that can break on a new kind.
4. A test asserts opening a row calls mark-read once and reduces the exposed unread count by one.
5. A test asserts mark-all-read issues one bulk call, not one per row.
6. A test asserts a paging walk with `limit: 10` over 24 seeded notifications yields all 24 exactly once.
7. A test asserts the sitter role and parent role render different kind sets for the same fixture data.
8. A test asserts `failureRate: 1` renders `ErrorState` with a working retry, and zero notifications renders the empty state.

## Blocked by

- 039 Skeleton / Spinner / EmptyState / ErrorState and ListRow
- 057 Hono business logic: matching / notification fan-out and scheduled jobs
