---
id: "097"
title: "Legal pages: terms / privacy / cookies and imprint"
repo: atlure-web
epic: web-marketing
priority: P0
size: M
serialize: "No"
milestone: M4
blocked_by: "095 Scaffold atlure-web with Next 16 / the DS packages and the theme script; 044 Web layout primitives: Container / Section / Stack / Grid / Prose"
labels: "epic:web-marketing; type:page; needs:david; blocked:waiting-on-decision"
---

# Legal pages: terms / privacy / cookies and imprint

## Context

The mobile signup flow links to `https://www.atlure.com/terms` and `/privacy` and blocks account creation until they are accepted, so these pages are a hard dependency of the M4 thin slice — not a nice-to-have. Atlure operates EU-wide and processes PII and sitter identity documents, so the privacy policy must be accurate about what is collected, where it is stored (Supabase, EU region) and how long it is kept.

## Scope

- `/terms`, `/privacy`, `/cookies` and `/imprint` rendered through the `Prose` primitive, statically generated, each with a visible last-updated date.
- Privacy content must accurately reflect the system: Supabase in an EU region, a Hono service, identity documents in a private bucket, location data used for radius search, message content stored, and analytics only with consent.
- Terms must state plainly that Atlure is an introduction platform, that it does not process payment or hold funds in v1, that arrangements are made directly between parent and sitter, and what that means for liability.
- Cookies page enumerating exactly the cookies and storage keys the site sets, kept in sync with the consent implementation in ticket 104.
- A shared legal layout with a table of contents generated from the headings and anchor links per section, so the app can deep-link to a clause.
- **The legal text itself requires David or a lawyer.** An agent may draft structure and the factual system description, but the operative clauses must be reviewed before launch. Mark the page with a build-time flag that fails CI if the placeholder marker is still present when building for production.

## Out of scope

The consent banner (ticket 104). Any per-country legal variation. Data subject access request tooling.

## Files you own

`app/(legal)/**`, `src/content/legal/**`, `src/components/legal/**`.

## Files you must NOT touch

Other page directories. `app/layout.tsx`.

## Acceptance criteria

1. `pnpm build` and `pnpm typecheck` exit 0.
2. A test asserts `/terms`, `/privacy`, `/cookies` and `/imprint` each return 200 and render a last-updated date.
3. A test asserts the table of contents entry count equals the number of `h2` elements on each page and that every anchor resolves to an existing id.
4. A test asserts the terms text contains a statement that Atlure does not process payments, and that no text claims it holds funds or provides insurance.
5. A test asserts the cookies page lists every key the site actually sets, compared against a committed list that ticket 104's implementation also reads — the two must not drift.
6. `PRODUCTION=1 pnpm build` exits non-zero while any file under `src/content/legal/` contains the placeholder marker, and exits 0 once reviewed text replaces it.
7. `axe` reports zero violations on all four pages.

## Blocked by

- 044 Web layout primitives: Container / Section / Stack / Grid / Prose
- 095 Scaffold atlure-web with Next 16 / the DS packages and the theme script
