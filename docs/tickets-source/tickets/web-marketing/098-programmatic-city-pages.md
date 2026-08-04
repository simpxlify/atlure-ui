---
id: "098"
title: "Programmatic local landing pages per city and service"
repo: atlure-web
epic: web-marketing
priority: P2
size: L
serialize: "No"
milestone: M5
blocked_by: "095 Scaffold atlure-web with Next 16 / the DS packages and the theme script; 049 PostGIS geography column / GiST index and the sitter radius search RPC; 101 SEO infrastructure: sitemap / robots / canonicals / OG images and structured data"
labels: "epic:web-marketing; type:page; area:seo"
---

# Programmatic local landing pages per city and service

## Context

Programmatic local SEO is the main reason `atlure-web` exists: pages like "dog walkers in Lisbon" that rank for local intent and hand the visitor to the app. They read Supabase directly with the anon key against the public-read policy for verified sitters, using `search_sitters_public`. Volume makes quality control mechanical rather than manual: a thin page with no sitters is worse than no page, so an empty city must not be indexed.

## Scope

- Dynamic route `/[country]/[city]/[service]` plus a `/[country]/[city]` hub, generated from a committed city dataset with population, coordinates and locale.
- Content per page: a localised heading, an intro paragraph assembled from templated fragments with enough variation to avoid boilerplate duplication, a sitter list from `search_sitters_public`, an average price range via a currency-correct formatter, nearby cities, and a service FAQ block.
- Sitter cards link to the indexable sitter profile pages (ticket 099).
- Rendering: statically generated for the top cities at build time, incrementally rendered on demand for the long tail, with a revalidation window.
- **Thin-content guard**: a city and service combination with fewer than a minimum number of verified sitters renders a `noindex` page with an honest "no sitters here yet" message and a waitlist call to action, and is excluded from the sitemap.
- Canonical URL per page and hreflang between country variants of the same city where they exist.
- `LocalBusiness` or `Service` structured data as appropriate, plus breadcrumbs.

## Out of scope

Sitter profile pages (ticket 099). The sitemap and metadata plumbing (ticket 101) — consume it. Paid acquisition landing pages. Machine translation of the templated copy — decide the language set and state it on the ticket.

## Files you own

`app/[country]/[city]/**`, `src/content/cities.ts`, `src/lib/city-copy.ts`, `src/lib/public-sitters.ts`.

## Files you must NOT touch

`src/lib/seo.ts` and `app/sitemap.ts` (ticket 101) — register your routes through the interface it exposes. `app/sitters/**` (ticket 099).

## Acceptance criteria

1. `pnpm build` and `pnpm typecheck` exit 0.
2. A test asserts a city with 5 seeded verified sitters renders 5 cards and is `index,follow`, and a city with 0 renders the empty variant with `noindex` in its robots metadata.
3. A test asserts the sitemap excludes every `noindex` city page and includes every indexable one — set equality against the generated list.
4. A test asserts two different cities produce intro paragraphs that differ by more than a name substitution, using a similarity threshold, so pages are not near-duplicates.
5. A test asserts the price range on a Lisbon page renders in EUR and a London page in GBP, driven by the sitter data rather than the locale.
6. A test asserts each page emits exactly one canonical link pointing at its own absolute URL built from `NEXT_PUBLIC_SITE_URL`.
7. A test validates the emitted JSON-LD against the schema.org type it claims, and asserts breadcrumb items resolve to real routes.
8. `pnpm test:lighthouse -- --url /pt/lisbon/dog-walking` reports an SEO score of at least 95.

## Blocked by

- 049 PostGIS geography column / GiST index and the sitter radius search RPC
- 095 Scaffold atlure-web with Next 16 / the DS packages and the theme script
- 101 SEO infrastructure: sitemap / robots / canonicals / OG images and structured data
