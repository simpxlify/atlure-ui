---
id: "094"
title: "Screens: help and support / refer a friend"
repo: atlure-paw
epic: paw-screens
priority: P2
size: L
serialize: "No"
milestone: M5
blocked_by: "042 Web Card and Accordion; 033 Input / Textarea / Label / FormField and SearchBar; 065 Supabase adapter passing the same conformance suite as the mock"
labels: "epic:paw-screens; type:screen; flow:profile"
---

# Screens: help and support / refer a friend

## Context

References: `atlure-spec-reference/src/app/components/HelpSupportScreen.tsx` — at 35 KB the single largest file in the prototype, covering help articles, support tickets and support agents (the `HelpArticle`, `SupportTicket` and `SupportAgent` types in the domain model) — and `ReferAFriendScreen.tsx`. Both are reached from the profile tab and neither is on the critical path, so they share a ticket. The 35 KB is mostly hard-coded article copy, not logic.

## Scope

Help and support:

- Searchable help-article list from `SupportPort`, grouped by category, with an article detail view rendering stored content. Article copy is data, not code — it comes from the API, so this screen is a renderer.
- Support tickets: list with `status` and `priority` badges, a detail view with the message thread, and a create form with category, subject and body.
- Contact options: a support agent list showing `isOnline` presence and response time, with a start-conversation action.
- Article helpfulness voting, recording against `helpful` and `views`.
- All four states per section, with an empty state for no tickets.

Refer a friend:

- The user's referral code with copy and native share actions, a short explanation, and a list of referrals and their state.
- **The reward mechanics are undecided** because monetization is undecided (tickets 112, 113). Build the screen with the reward text sourced from a single config value and state clearly on the ticket that the copy is a placeholder pending that decision. Do not invent a reward.

Flip both route entries' `status` to `live`.

## Out of scope

A CMS or authoring tool for help articles. Live chat. Any actual reward issuance or credit balance. If `SupportPort` methods do not exist, report on ticket 063 rather than adding them.

## Files you own

The help-support and refer routes, `src/screens/support/**`, `src/screens/refer/**`, two lines of `src/navigation/routes.ts`.

## Files you must NOT touch

`src/data/ports/**` (ticket 063). `src/screens/messaging/**` (tickets 084-086) — navigate to it. Other route files.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts article content is fetched, not embedded: `wc -c` on every file under `src/screens/support/` is under 8000 bytes each, and `grep -rc "Lorem\|How do I" src/screens/support` finds no article bodies in source.
3. A test asserts the search field filters articles and renders a no-results state distinct from an empty list.
4. A test asserts creating a support ticket posts once, renders it in the list, and that a validation failure maps to a field error.
5. A test asserts a `SupportTicket` renders both its `status` and `priority` as badges with distinct styles per value, covering every enum member.
6. A test asserts the helpful vote posts once per article per session and disables afterwards.
7. A test asserts the referral code is copied to the clipboard and that the share action is invoked with a URL containing the code.
8. A test asserts the reward copy comes from the single config value and that changing that value changes the rendered text — proving no reward wording is hard-coded.
9. `git diff --stat src/navigation/routes.ts` shows exactly two changed lines.

## Blocked by

- 033 Input / Textarea / Label / FormField and SearchBar
- 042 Web Card and Accordion
- 065 Supabase adapter passing the same conformance suite as the mock
