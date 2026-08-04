---
id: "102"
title: "Sitter waitlist and newsletter forms"
repo: atlure-web
epic: web-marketing
priority: P2
size: S
serialize: "No"
milestone: M5
blocked_by: "043 Web Input / Textarea / Label and FormField; 096 Core marketing pages: home / how it works / for sitters"
labels: "epic:web-marketing; type:page; area:forms"
---

# Sitter waitlist and newsletter forms

## Context

These are the only two forms on the marketing site. The sitter waitlist collects interest in cities where Atlure has no sitters yet — which is exactly what the thin-content city pages (ticket 098) offer instead of an empty list — and the newsletter captures general interest. Both are public and unauthenticated, so spam protection and consent handling are the substance of the ticket, not the fields.

## Scope

- A server action per form, with Zod validation server-side as well as native client validation, so JavaScript-disabled submission still works.
- Waitlist fields: email, city, country, service kinds of interest. Newsletter: email only.
- Explicit, unticked marketing consent checkbox on both, with the consent text and timestamp stored alongside the record — required under EU rules, and the reason a bare email row is not sufficient.
- Storage: a `marketing_leads` table with `anon`-insert-only RLS and no select for anon. If that table does not exist, request it on ticket 047 rather than creating a migration from this repo.
- Spam protection: the honeypot field from ticket 043, a submission timestamp check, and per-IP rate limiting at the edge. No third-party captcha.
- Duplicate handling: a repeat email updates the existing row rather than erroring, and the user sees the same success state either way, so the form cannot be used to enumerate subscribers.
- Success and error states rendered inline without navigation, and a working non-JavaScript fallback path.
- An unsubscribe route keyed by a signed token, since a newsletter without one is not lawful to send.

## Out of scope

Sending any email or integrating an email service provider — capture only, and note the gap. A CRM integration. Any authenticated flow.

## Files you own

`src/components/forms/**`, `app/actions/leads.ts`, `app/unsubscribe/**`.

## Files you must NOT touch

`app/page.tsx` and `app/for-sitters/page.tsx` beyond inserting the form component (ticket 096). `atlure-api/supabase/migrations/**` — request the table on ticket 047. `src/lib/supabase.ts` (ticket 095).

## Acceptance criteria

1. `pnpm build` and `pnpm typecheck` exit 0.
2. A test asserts submitting without consent is rejected server-side even when the client check is bypassed, and that no row is written.
3. A test asserts a successful submission stores the email, the consent text and a consent timestamp.
4. A test asserts a filled honeypot field results in a success response to the client and zero rows written.
5. A test asserts submitting the same email twice yields one row and the same success state both times, with no message revealing that the address already existed.
6. A test asserts the form submits successfully with JavaScript disabled, via a Playwright run with scripts blocked.
7. A test asserts anon cannot select from `marketing_leads`: a direct anon query returns zero rows or an error.
8. A test asserts the unsubscribe route rejects a tampered token and succeeds with a valid one.

## Blocked by

- 043 Web Input / Textarea / Label and FormField
- 096 Core marketing pages: home / how it works / for sitters
