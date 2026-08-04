---
id: "093"
title: "Screens: bookmarks and activity"
repo: atlure-paw
epic: paw-screens
priority: P2
size: M
serialize: "No"
milestone: M5
blocked_by: "071 Screen: find a sitter — search / results / paging and states; 039 Skeleton / Spinner / EmptyState / ErrorState and ListRow"
labels: "epic:paw-screens; type:screen; flow:profile"
---

# Screens: bookmarks and activity

## Context

References: `atlure-spec-reference/src/app/components/BookmarksScreen.tsx` (18 KB) and `ActivityScreen.tsx` (17 KB). Both are role-aware paged lists of saved or past items, both take `userRole`, and both are structurally a filtered list with tabs — so they share a ticket. Bookmarks is a bottom-tab destination; activity is reached from the profile tab.

## Scope

Bookmarks:

- Tabs for saved sitters and saved requests (the sitter-side equivalent), each cursor-paged.
- Rows reuse the search result-row component from ticket 071 for sitters — do not write a third sitter card.
- Un-bookmarking removes the row optimistically and reverts on failure.
- Empty state per tab explaining how to save an item, with an action into search.

Activity:

- Tabs for upcoming and past bookings, role-aware, each cursor-paged.
- Rows show counterparty, pet, dates, status badge and agreed amount labelled as settled off-platform.
- A completed booking without a review shows a leave-review action opening the sheet from ticket 089.
- Empty states per tab.

Both:

- All four states per tab independently.
- Flip both route entries' `status` to `live` — two lines.

## Out of scope

Search (ticket 071). The review sheet's contents (ticket 089). Booking status actions — those live in the day agenda (ticket 082); link there instead of duplicating them.

## Files you own

The bookmarks and activity route files, `src/screens/bookmarks/**`, `src/screens/activity/**`, two lines of `src/navigation/routes.ts`.

## Files you must NOT touch

`src/screens/search/**` (ticket 071) — import the result row. `src/screens/reviews/**` (ticket 089) — open its sheet. `src/screens/schedule/**` (tickets 081-083). Other route files.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts the bookmarks sitter row is the component exported by `src/screens/search/results/`: `ls src/screens/bookmarks | grep -ci "card"` prints `0`.
3. A test asserts un-bookmarking removes the row immediately and restores it when the call returns a failed `Result`.
4. A test asserts activity's upcoming tab renders only bookings with a future `starts_at` and the past tab only those with a past `ends_at`, using seeded fixtures.
5. A test asserts a completed booking with no review renders the leave-review action and one with a review does not.
6. A test asserts each tab pages independently, keeping its own cursor and scroll position when switching back and forth.
7. A test asserts every tab has a distinct empty state whose action navigates somewhere useful.
8. `git diff --stat src/navigation/routes.ts` shows exactly two changed lines.

## Blocked by

- 039 Skeleton / Spinner / EmptyState / ErrorState and ListRow
- 071 Screen: find a sitter — search / results / paging and states
