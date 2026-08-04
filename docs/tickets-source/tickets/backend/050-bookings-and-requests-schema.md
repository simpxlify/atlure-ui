---
id: "050"
title: "Schema: service requests / bookings and status transitions"
repo: atlure-api
epic: backend
priority: P0
size: L
serialize: "Yes"
milestone: M3
blocked_by: "048 Schema: sitter profiles / services and availability"
labels: "epic:backend; type:schema; serialize"
---

# Schema: service requests / bookings and status transitions

## Context

The prototype has two request shapes — a pet request a sitter browses and accepts (`PetRequest`) and a home-sitting request (`HomeSittingRequest`) — plus a booking that results from one. **There are no payments in v1**: parents and sitters settle off-platform and Atlure takes no cut, so a booking records an agreed price for reference only and has no payment state. Status must be a constrained transition graph, not a free-text field, or every screen will invent its own valid transitions.

## Scope

One migration creating:

- `service_requests`: `id`, `parent_id`, `kind`, `pet_ids` (join table `service_request_pets`, not an array), `location_city`, `location geography(Point,4326)`, `starts_at`, `ends_at`, `urgency` enum, `description`, `offered_amount` + `offered_currency`, `status` enum (`open`,`matched`,`cancelled`,`expired`), timestamps.
- `home_sitting_requests` extension table for the property-specific fields: `home_type`, `title`, `home_image_url`, plus a join to `amenities`.
- `bookings`: `id`, `request_id` nullable (a booking can be created directly from a sitter profile), `parent_id`, `sitter_id`, `service_kind`, `starts_at`, `ends_at`, `agreed_amount`, `agreed_currency`, `status` enum (`requested`,`accepted`,`declined`,`cancelled-by-parent`,`cancelled-by-sitter`,`in-progress`,`completed`,`no-show`), `cancellation_reason`, timestamps.
- `booking_status_history` appending every transition with actor and timestamp, so disputes are answerable.
- A trigger enforcing the legal transition graph, rejecting anything else with a clear message. `requested` may go to `accepted`, `declined` or a cancellation; `accepted` to `in-progress`, a cancellation or `no-show`; `in-progress` to `completed`; terminal states go nowhere.
- An exclusion constraint preventing a sitter holding two overlapping `accepted` or `in-progress` bookings.
- A `sitter_available_for` function combining `sitter_availability`, exceptions and existing bookings, so date-aware search is answerable.
- RLS enabled; policies deferred to ticket 054.

## Out of scope

Any payment, payout, escrow, invoice or commission column — explicitly deferred to the monetization decision (tickets 112, 113). Matching logic (ticket 057). Notifications.

## Files you own

One new timestamped migration and one new pgTAP test file.

## Files you must NOT touch

Any existing migration. Do not add payment-related columns "for later" — the monetization model is undecided and the wrong columns would constrain it.

## Acceptance criteria

1. `supabase db reset` exits 0 and `supabase test db` passes.
2. A pgTAP test asserts updating a booking from `completed` to `accepted` raises an error naming the illegal transition, and that `requested` to `accepted` succeeds.
3. A pgTAP test asserts every status change appends exactly one `booking_status_history` row with the acting profile id.
4. A pgTAP test asserts inserting a second `accepted` booking for the same sitter overlapping an existing one raises an exclusion violation, while a non-overlapping one succeeds.
5. A pgTAP test asserts `sitter_available_for` returns false for a sitter with an `accepted` booking covering the requested window and true otherwise.
6. `grep -riE "payment|payout|stripe|commission|escrow" supabase/migrations` prints nothing.

## Blocked by

- 048 Schema: sitter profiles / services and availability
