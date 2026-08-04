---
id: "104"
title: "Analytics with consent gating / and error observability across all repos"
repo: all
epic: quality
priority: P1
size: M
serialize: "No"
milestone: M5
blocked_by: "090 Screens: edit profile and security settings; 097 Legal pages: terms / privacy / cookies and imprint"
labels: "epic:quality; type:observability"
---

# Analytics with consent gating / and error observability across all repos

## Context

Atlure operates EU-wide and stores PII and identity documents, so analytics must be off until consented, and the cookies page (ticket 097) enumerates exactly what is set. Observability matters more than usual here because a NativeWind transform failure produces no error at all — the failure mode is silent, so crash reporting is not the only signal needed.

## Scope

- One analytics client wrapper per surface (app, web) behind a single interface, so events are declared in a typed catalogue rather than as free-text strings.
- Consent gating: no analytics or session-replay call fires before consent. On the web, a consent banner with accept and reject, storing the choice in a first-party cookie enumerated on the cookies page. In the app, the privacy toggle from ticket 090 is the gate.
- Rejecting consent must disable collection and delete anything already stored locally, and rejection must be as easy as acceptance.
- Sentry (or equivalent) in all four repos: `atlure-paw` with source maps uploaded per EAS build, `atlure-web` with server and client, `atlure-api` in the Hono error handler, `atlure-ui` for CI failures only.
- Scrub PII from every event and error payload: no email, phone, message body, document path or exact coordinate. Coordinates are truncated to city granularity before leaving the device.
- A typed event catalogue covering the M4 thin-slice funnel: sign up, choose role, add pet, search sitters, open sitter profile, request booking.
- Release health: tie events and errors to the app version and build number so a bad release is identifiable.

## Out of scope

A dashboard or reporting layer. A/B testing. Product metrics analysis.

## Files you own

`src/analytics/**` in `atlure-paw` and `atlure-web`, `src/components/consent/**` in `atlure-web`, `src/lib/observability.ts` in `atlure-api`, Sentry config files in all four repos.

## Files you must NOT touch

`src/screens/settings/**` in `atlure-paw` (ticket 090) — it calls your disable path. `src/content/legal/**` (ticket 097) — but the cookie key list must match; add keys to the shared list both read.

## Acceptance criteria

1. Every repo's `pnpm build` or equivalent exits 0.
2. A test asserts zero network calls to the analytics host before consent, and that the first call happens only after accepting — asserted by intercepting requests.
3. A test asserts rejecting consent deletes previously stored analytics keys and that subsequent event calls are no-ops.
4. A test asserts the consent banner's reject control is present and reachable in the same number of interactions as accept.
5. A test asserts the cookie keys the implementation sets are exactly the list on the cookies page, compared against the shared committed list — a mismatch fails.
6. A test asserts an event payload containing an email, a phone number and a full coordinate is scrubbed before send: the outgoing body matches none of those patterns and the coordinate is truncated.
7. A test asserts every event in the thin-slice funnel is declared in the typed catalogue and that an undeclared event name fails to compile.
8. A deliberately thrown error in each of the four repos appears in the error tracker tagged with the correct release version — verified once manually and recorded on the ticket.

## Blocked by

- 090 Screens: edit profile and security settings
- 097 Legal pages: terms / privacy / cookies and imprint
