---
id: "086"
title: "Screen: messaging — composer / attachments and realtime delivery"
repo: atlure-paw
epic: paw-screens
priority: P1
size: M
serialize: "No"
milestone: M5
blocked_by: "085 Screen: messaging — thread view and history paging; 053 Storage buckets: public pet photos and private ID documents; 051 Schema and Realtime: conversations / messages and live tracking channels"
labels: "epic:paw-screens; type:screen; flow:messaging; area:realtime"
---

# Screen: messaging — composer / attachments and realtime delivery

## Context

Third of three messaging tickets, and the one that makes the feature real. Realtime was designed into the port interfaces from day one (ticket 063) precisely so this could be added without rewriting the thread. Messages arrive through Postgres Changes on `messages`, filtered by conversation, and RLS applies to realtime rows too, so a non-participant receives nothing.

## Scope

- Composer: multiline input that grows to a cap, send action disabled when empty or only whitespace, keyboard-aware so it stays above the keyboard on both platforms.
- Optimistic send through `ThreadContext.append` with a `sending` state, reconciled when the server row arrives, and a `failed` state with a retry that does not duplicate the message.
- Attachments: image pick or camera, uploaded to the private `message-attachments` bucket through `StoragePort`, rendered as a thumbnail with a full-screen viewer, fetched via a signed URL.
- Realtime subscription via `MessagePort.subscribeToConversation`, unsubscribing on unmount. Deduplicate against the optimistic message by client id so a sent message never appears twice.
- Reconnect handling: after a network drop, resubscribe and backfill any messages missed while offline, then dedupe.
- Offline queue: a message composed while offline is queued, shown as pending, and sent on reconnect in order.
- Advance `last_read_at` when a new message arrives while the thread is focused, and not when backgrounded.
- Typing indicator over Realtime broadcast, if it can be done without a schema change; otherwise skip it and note the decision.

## Out of scope

Voice notes, reactions and message editing. Push notifications for new messages (ticket 108). The thread list rendering (ticket 085).

## Files you own

`src/screens/messaging/thread/composer/**`, `src/screens/messaging/thread/use-realtime-messages.ts`, `src/messaging/outbox.ts`.

## Files you must NOT touch

`src/screens/messaging/thread/message-list/**` and `thread-screen.tsx` (ticket 085) — append through `ThreadContext`; if it lacks something, report on 085. `src/screens/messaging/list/**`. `src/data/**`. Any route file.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts sending renders the message optimistically with a `sending` state and that the server echo does **not** produce a second bubble — the rendered count stays at one.
3. A test asserts a failed send renders the failed state and that retrying results in exactly one persisted message.
4. An integration test with two authenticated clients asserts client B's thread renders A's message within 2 seconds without a manual refresh.
5. A test asserts unmounting the thread calls the unsubscribe function and that no handler runs afterwards.
6. A test simulating a socket drop and restore asserts messages sent during the outage appear exactly once after backfill.
7. A test asserts a message composed while offline is queued, rendered as pending, and sent once on reconnect, preserving order across two queued messages.
8. A test asserts an attachment is uploaded to `message-attachments` and rendered from a signed URL, and that a non-participant client cannot fetch that URL's object.
9. A test asserts `last_read_at` advances on an incoming message while focused and does not while backgrounded.

## Blocked by

- 051 Schema and Realtime: conversations / messages and live tracking channels
- 053 Storage buckets: public pet photos and private ID documents
- 085 Screen: messaging — thread view and history paging
