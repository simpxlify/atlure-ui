---
id: "099"
title: "Indexable public sitter profile pages"
repo: atlure-web
epic: web-marketing
priority: P2
size: M
serialize: "No"
milestone: M5
blocked_by: "095 Scaffold atlure-web with Next 16 / the DS packages and the theme script; 054 RLS policies across every table / with an adversarial verification suite; 101 SEO infrastructure: sitemap / robots / canonicals / OG images and structured data"
labels: "epic:web-marketing; type:page; area:seo; area:security"
---

# Indexable public sitter profile pages

## Context

Public sitter profiles are the second half of the SEO strategy: they rank for name and neighbourhood queries and are the deep-link target from the app's universal links. They also carry the project's highest privacy risk on the web, because they read Supabase directly with the anon key. The public-read policy is scoped to verified sitters and a limited column set, and this page must not render anything beyond it — no phone number, no exact address, no email, no document.

## Scope

- Route `/sitters/[slug]` where the slug is a stable public identifier, not a raw UUID exposed in a guessable sequence.
- Content: display name, avatar, headline, about, service kinds with rates, accepted species, aggregate rating and visible reviews, approximate location as city only, and response time.
- A prominent "open in the Atlure app" call to action wired to the universal link from ticket 103, with a store fallback.
- `Person` plus `AggregateRating` structured data, only when the sitter actually has visible reviews — never fabricate a rating.
- Unverified, unlisted or deleted sitters return a 404, not an empty page, and are absent from the sitemap.
- `noindex` for a sitter with no services or an empty profile, so thin pages do not enter the index.
- A sitter-facing opt-out honoured from the discoverability toggle in ticket 090: opting out returns 404 and removes the page from the sitemap on the next revalidation.
- Incremental static regeneration with a revalidation window, so rating changes appear without a rebuild.

## Out of scope

Contacting a sitter from the web — all interaction happens in the app. Booking on the web. The city pages that link here (ticket 098).

## Files you own

`app/sitters/[slug]/**`, `src/lib/public-sitter-profile.ts`.

## Files you must NOT touch

`src/lib/seo.ts` and `app/sitemap.ts` (ticket 101). `src/lib/public-sitters.ts` (ticket 098) — if it needs a field, add your own loader rather than editing it. Any RLS policy — if a needed field is not publicly readable, report on ticket 054.

## Acceptance criteria

1. `pnpm build` and `pnpm typecheck` exit 0.
2. A test asserts the rendered HTML for a seeded sitter contains no phone number, email address, street address or storage URL — asserted by matching the response body against patterns for each and expecting no hits.
3. A test asserts an unverified sitter's slug returns HTTP 404 and is absent from the sitemap.
4. A test asserts a sitter with discoverability off returns 404 after revalidation.
5. A test asserts `AggregateRating` JSON-LD is emitted only when `review_count` is greater than zero, and omitted otherwise.
6. A test asserts the emitted JSON-LD validates against `Person` and that the rating value matches `profile_rating_aggregates` exactly.
7. A test asserts the open-in-app link is the universal link format from ticket 103 and that a desktop user agent still sees a usable page.
8. `axe` reports zero violations, and `pnpm test:lighthouse -- --url /sitters/<seeded-slug>` reports an SEO score of at least 95.

## Blocked by

- 054 RLS policies across every table / with an adversarial verification suite
- 095 Scaffold atlure-web with Next 16 / the DS packages and the theme script
- 101 SEO infrastructure: sitemap / robots / canonicals / OG images and structured data
