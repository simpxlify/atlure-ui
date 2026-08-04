---
id: "084"
title: "Screen: messaging — conversation list"
repo: atlure-paw
epic: paw-screens
priority: P1
size: M
serialize: "No"
milestone: M5
blocked_by: "065 Supabase adapter passing the same conformance suite as the mock; 039 Skeleton / Spinner / EmptyState / ErrorState and ListRow; 031 Avatar / AvatarGroup and presence indicator"
labels: "epic:paw-screens; type:screen; flow:messaging"
---

# Screen: messaging — conversation list

## Context

First of three messaging tickets. The prototype has no conversation list at all: the messages tab jumps straight into a single hard-coded thread with `contactName="Sarah M."`. A real app needs an inbox, and it is the screen the unread badge on the tab bar depends on. This ticket lands the list and the unread model; ticket 085 owns the thread; ticket 086 owns the composer and realtime.

## Scope

- The messages tab route rendering a cursor-paged list of conversations from `MessagePort`, ordered by `last_message_at`.
- Each row via `ListRow`: counterparty avatar with presence, display name, the last message preview truncated to one line, a relative timestamp via `DateLabel`, and an unread count badge.
- Unread counts come from the single-round-trip unread function, not from counting messages client-side.
- A search field filtering conversations by counterparty name.
- Tapping a row opens the thread route with the conversation id.
- Swipe actions: mark read and mute. Muting is a client-persisted preference if the schema has no column — check and report on ticket 051 rather than adding one.
- Expose the total unread count so the tab bar badge reads it from one place; put that in `src/messaging/unread.ts` since tickets 085 and 086 also need it.
- All four states: skeleton rows, error with retry, and an empty inbox explaining that conversations start from a sitter profile or a booking, with an action to search sitters.
- Flip this route's `status` to `live`.

## Out of scope

The thread view (ticket 085) and the composer or realtime (ticket 086). Group conversations. Push notifications (ticket 108).

## Files you own

The messages route file, `src/screens/messaging/list/**`, `src/messaging/unread.ts`, one line of `src/navigation/routes.ts`.

## Files you must NOT touch

`src/screens/messaging/thread/**` (tickets 085, 086). `app/(tabs)/_layout.tsx` — the badge reads `src/messaging/unread.ts`; if the layout needs a change, request it on ticket 059. Other route files.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts rows render in descending `last_message_at` order for the seeded fixtures.
3. A test asserts the unread badge value comes from the unread function: with a mock returning 4, the badge reads 4, and `grep -rn "\.filter(" src/screens/messaging/list --include=*.ts*` shows no client-side unread counting.
4. A test asserts a paging walk with `limit: 3` over 7 seeded conversations yields all 7 exactly once.
5. A test asserts the search field filters to matching counterparty names and renders a no-results state distinct from the empty inbox.
6. A test asserts the empty inbox renders its explanation and that its action navigates to search.
7. A test asserts `failureRate: 1` renders `ErrorState` with a retry that issues exactly one new request.
8. A test asserts mark-read reduces the exposed total unread count to zero for that conversation.

## Blocked by

- 031 Avatar / AvatarGroup and presence indicator
- 039 Skeleton / Spinner / EmptyState / ErrorState and ListRow
- 065 Supabase adapter passing the same conformance suite as the mock
