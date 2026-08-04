---
id: "052"
title: "Schema: reviews / ratings and aggregate rollups"
repo: atlure-api
epic: backend
priority: P1
size: M
serialize: "Yes"
milestone: M5
blocked_by: "050 Schema: service requests / bookings and status transitions"
labels: "epic:backend; type:schema; serialize"
---

# Schema and rollups for reviews and ratings

## Context

Every sitter card, sitter profile and pet card in the prototype shows a rating, and the marketing site's indexable sitter profiles need an aggregate rating for `AggregateRating` structured data. Computing an average over all reviews on every card render does not scale, so aggregates are maintained rows. Reviews must be tied to a completed booking or the rating is meaningless.

## Scope

One migration creating:

- `reviews`: `id`, `booking_id` unique, `author_id`, `subject_id`, `direction` enum (`parent-to-sitter`,`sitter-to-parent`), `rating` smallint 1-5, `body`, `created_at`, `edited_at`, `is_hidden` for moderation.
- A check constraint that the booking's status is `completed` at insert time, enforced by a trigger since it needs a lookup.
- A constraint that `author_id` is one of the booking's two participants and `subject_id` is the other.
- `profile_rating_aggregates`: `profile_id`, `direction`, `review_count`, `rating_sum`, `rating_avg` generated, maintained by a trigger on insert, update, hide and delete.
- A `review_tags` join table for the fixed positive/negative tag chips the leave-review modal uses.
- A double-blind reveal rule: a review is visible only once both sides have reviewed or 14 days have passed since booking completion. Implement as a `is_visible` generated or trigger-maintained column so RLS can key on it simply.
- RLS enabled; policies deferred to ticket 054.

## Out of scope

The leave-review screen (ticket 089) and the sitter profile display. Moderation tooling or an admin surface. Responses to reviews.

## Files you own

One new timestamped migration and one new pgTAP test file.

## Files you must NOT touch

Any existing migration.

## Acceptance criteria

1. `supabase db reset` exits 0 and `supabase test db` passes.
2. A pgTAP test asserts inserting a review for a booking whose status is `accepted` raises an error, and succeeds once the booking is `completed`.
3. A pgTAP test asserts a second review for the same `booking_id` and `direction` raises a unique violation.
4. A pgTAP test asserts inserting three reviews with ratings 5, 4 and 3 leaves `review_count = 3` and `rating_avg = 4.0`, and that hiding one changes the aggregate to `2` and `4.5`.
5. A pgTAP test asserts a review with only one side submitted and a booking completed 3 days ago has `is_visible = false`, and that backdating completion to 15 days ago makes it true.
6. A pgTAP test asserts an `author_id` who is not a booking participant is rejected.

## Blocked by

- 050 Schema: service requests / bookings and status transitions
