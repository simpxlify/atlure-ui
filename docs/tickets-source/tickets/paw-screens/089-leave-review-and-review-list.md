---
id: "089"
title: "Screen: leave a review and the review list"
repo: atlure-paw
epic: paw-screens
priority: P1
size: M
serialize: "No"
milestone: M5
blocked_by: "052 Schema: reviews / ratings and aggregate rollups; 030 Badge / Chip / UrgencyBadge and StarRating; 082 Screen: schedule — day agenda and booking detail"
labels: "epic:paw-screens; type:screen; flow:reviews"
---

# Screen: leave a review and the review list

## Context

Reference: `atlure-spec-reference/src/app/components/LeaveReviewModal.tsx` — a star selector with hover labels (`Poor`, `Fair`, `Good`, `Great`, `Amazing!`), a text body and a submitted state. The schema adds rules the prototype has none of: a review requires a `completed` booking, one review per booking per direction, and **double-blind reveal** — a review becomes visible only once both sides have reviewed or 14 days pass. The UI must explain that, or users will think their review vanished.

## Scope

- A review sheet reached from a completed booking in the day agenda and from a prompt after completion: `StarRating interactive` with the rating labels, optional tag chips from `review_tags`, and a body field.
- Both directions supported: a parent reviews a sitter and a sitter reviews a parent, with direction-appropriate prompts.
- After submit, a state explaining the reveal rule and when the review will appear. No implication that it is already public.
- Edit within a grace window if the schema's `edited_at` allows it; otherwise the submitted review is final and the UI says so.
- A review list component used by the sitter profile and the parent profile: paged, showing author avatar, rating, tags, body and relative date, with the aggregate rating and count at the top from `profile_rating_aggregates`.
- Hidden and not-yet-revealed reviews are excluded by RLS, so the list must render an accurate count that matches what the aggregate reports, not a client-side count of fetched rows.
- All four states, and a state for a booking that is not yet reviewable.

## Out of scope

Moderation, reporting a review, or a sitter's public response. Editing the aggregate logic (ticket 052).

## Files you own

`src/screens/reviews/**`, and the review-list component exported from there.

## Files you must NOT touch

`src/screens/sitter-profile/**` (ticket 078) and `src/screens/profile/**` (ticket 091) — they import your list component; if it needs a prop they lack, add the prop here. `src/screens/schedule/**`. Any route file — this is a sheet plus a shared component.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts each of the five rating values renders its matching label.
3. A test asserts submitting for a booking that is not `completed` is blocked with an explanation and issues zero write calls.
4. A test asserts a second submit for the same booking and direction is blocked and that the existing review is shown instead.
5. A test asserts the post-submit state explains the reveal rule and does not claim the review is visible.
6. A test asserts the list's displayed count comes from `profile_rating_aggregates` and not from the fetched array length: with an aggregate of 12 and a first page of 5, the header reads 12.
7. A test asserts a paging walk over 12 seeded reviews with `limit: 5` yields all 12 exactly once.
8. A test asserts a not-yet-revealed review is absent from the list for a third-party viewer and present for its author.

## Blocked by

- 030 Badge / Chip / UrgencyBadge and StarRating
- 052 Schema: reviews / ratings and aggregate rollups
- 082 Screen: schedule — day agenda and booking detail
