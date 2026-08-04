---
id: "085"
title: "Screen: messaging — thread view and history paging"
repo: atlure-paw
epic: paw-screens
priority: P1
size: M
serialize: "No"
milestone: M5
blocked_by: "084 Screen: messaging — conversation list"
labels: "epic:paw-screens; type:screen; flow:messaging"
---

# Screen: messaging — thread view and history paging

## Context

Second of three messaging tickets. Reference: `atlure-spec-reference/src/app/components/MessagingScreen.tsx` — a header with contact name, image, online state and pet name, over a fixed message array. This ticket owns the thread route, the header, the message list and history paging. Ticket 086 owns the composer, attachments and realtime, so this ticket must land the list in a state that 086 can append to without restructuring it.

## Scope

- Thread route keyed by conversation id, with a header showing the counterparty avatar and presence, display name, the related pet or booking, and a tap through to the counterparty profile.
- Inverted virtualised message list: own messages right-aligned, counterparty left, grouped by sender with day separators via `DateLabel`.
- Backward history paging as the user scrolls up, cursor-based, keeping scroll position stable across page loads — the detail most likely to be wrong, so it has its own acceptance criterion.
- Read receipts derived from `conversation_participants.last_read_at`; entering the thread advances the caller's `last_read_at` once, not on every render.
- Message states rendered: sending, sent, failed. Ticket 086 supplies the sending path; this ticket defines the state rendering and reserves the append point.
- Soft-deleted messages render as a removed placeholder rather than disappearing, so a thread does not silently change shape.
- All four states: skeleton bubbles, error with retry, and an empty thread inviting the first message.
- Flip nothing — ticket 084 flipped the messages route; the thread route gets flipped here if ticket 059 landed it separately, in which case it is one line.

## Out of scope

The composer, attachments, typing indicators and realtime delivery (ticket 086). The conversation list (ticket 084).

## Files you own

The thread route file, `src/screens/messaging/thread/thread-screen.tsx`, `src/screens/messaging/thread/message-list/**`, `src/screens/messaging/thread/thread-context.tsx`.

## Files you must NOT touch

`src/screens/messaging/list/**` (ticket 084) and `src/messaging/unread.ts`. `src/screens/messaging/thread/composer/**` (ticket 086). Other route files.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts a backward page load leaves the currently visible message at the same offset — the scroll anchor is preserved, asserted by comparing the measured offset before and after.
3. A test asserts a history walk over 25 seeded messages with `limit: 10` renders all 25 exactly once with no duplicates.
4. A test asserts day separators appear exactly once per distinct local calendar day in the fixture set.
5. A test asserts entering the thread calls the mark-read mutation exactly once across three re-renders.
6. A test asserts a `deleted_at` message renders the removed placeholder and not its body text.
7. A test asserts `ThreadContext` exposes an append method and the message array, so ticket 086 can add an optimistic message without editing the list component.
8. A test asserts `failureRate: 1` renders `ErrorState` with a working retry.

## Blocked by

- 084 Screen: messaging — conversation list
