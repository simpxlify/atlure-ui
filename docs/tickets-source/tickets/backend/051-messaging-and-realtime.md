---
id: "051"
title: "Schema and Realtime: conversations / messages and live tracking channels"
repo: atlure-api
epic: backend
priority: P0
size: L
serialize: "Yes"
milestone: M3
blocked_by: "050 Schema: service requests / bookings and status transitions"
labels: "epic:backend; type:schema; area:realtime; serialize"
---

# Schema and Realtime: conversations / messages and live tracking channels

## Context

Messaging and live GPS tracking are two of the 25 screens, and realtime is in the data-layer interface from day one specifically because retrofitting subscriptions later is a screen rewrite. Messages are persisted rows with Postgres Changes replication; live location is high-frequency and ephemeral, so it uses Realtime **broadcast** and is not written to a table on every tick.

## Scope

One migration plus Realtime configuration:

- `conversations`: `id`, `booking_id` nullable, participant pair, `last_message_at`, `created_at`. Unique on the ordered participant pair per booking so a duplicate thread cannot be created.
- `conversation_participants` with `last_read_at`, which is what drives unread badges.
- `messages`: `id`, `conversation_id`, `sender_id`, `body`, `attachment_url` nullable, `kind` enum (`text`,`image`,`system`), `created_at`, `edited_at`, `deleted_at` for soft delete.
- A trigger maintaining `conversations.last_message_at`.
- Index on `(conversation_id, created_at desc)` for cursor paging of message history.
- Add `messages` and `bookings` to the `supabase_realtime` publication so clients receive Postgres Changes; document that RLS applies to realtime rows too.
- `booking_tracking_sessions`: `booking_id`, `started_at`, `ended_at`, plus a `booking_tracking_points` table storing a **decimated** path (one point per 30 seconds) for the post-walk summary map. Live ticks go over broadcast only.
- A documented channel naming convention: `booking:<id>:tracking` for broadcast, with an authorisation check so only the booking's two participants may join.
- An unread-count function returning per-conversation unread totals in one round trip.

## Out of scope

The messaging and tracking screens (tickets 084, 085, 086, 087). Push notifications (ticket 108). Attachment upload buckets (ticket 053).

## Files you own

One new timestamped migration, one pgTAP test file, and `docs/realtime-channels.md`.

## Files you must NOT touch

Any existing migration. `src/` — Hono is not in the messaging path.

## Acceptance criteria

1. `supabase db reset` exits 0 and `supabase test db` passes.
2. A pgTAP test asserts creating a second conversation for the same participant pair and booking raises a unique violation.
3. A pgTAP test asserts inserting a message updates the parent conversation's `last_message_at` to the message's `created_at`.
4. A pgTAP test asserts `select * from pg_publication_tables where pubname = 'supabase_realtime'` includes `messages` and `bookings`.
5. An integration test using two authenticated `supabase-js` clients asserts client B receives an INSERT event within 2 seconds of client A sending a message in a shared conversation, and that a third unrelated client receives nothing.
6. A pgTAP test asserts the unread-count function returns 2 for a conversation with two messages newer than the participant's `last_read_at`, and 0 after `last_read_at` is advanced.

## Blocked by

- 050 Schema: service requests / bookings and status transitions
