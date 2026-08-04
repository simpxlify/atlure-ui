---
id: "101"
title: "SEO infrastructure: sitemap / robots / canonicals / OG images and structured data"
repo: atlure-web
epic: web-marketing
priority: P1
size: M
serialize: "Yes"
milestone: M4
blocked_by: "095 Scaffold atlure-web with Next 16 / the DS packages and the theme script"
labels: "epic:web-marketing; type:tooling; area:seo; serialize"
---

# SEO infrastructure: sitemap / robots / canonicals / OG images and structured data

## Context

Two later tickets generate pages in bulk — city pages (098) and sitter profiles (099) — and both need the same metadata plumbing. Landing it once, upfront, with a registration interface, keeps the sitemap and canonical logic in one owned file instead of duplicated across dynamic routes. This is a conflict hotspot: `app/sitemap.ts` would otherwise be edited by every page ticket.

## Scope

- `src/lib/seo.ts` exposing a single `buildMetadata()` helper producing Next `Metadata`: title template, description, canonical from `NEXT_PUBLIC_SITE_URL`, OG and Twitter cards, and a robots directive.
- A **route registry** (`src/lib/route-registry.ts`) where each page module exports its indexable URLs; `app/sitemap.ts` reads the registry rather than knowing about individual routes. City and sitter tickets register through this and never edit the sitemap.
- `app/robots.ts` allowing indexing in production and disallowing it on preview deployments, keyed off the Vercel environment — a preview deployment leaking into the index is a real and common failure.
- Dynamic OG image generation via the Next image response API, with a token-styled template. It must not depend on a brand asset that does not exist yet (ticket 109) — use the wordmark and colours, and note that the image is provisional.
- A typed JSON-LD helper per schema type used (`Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`, `Person`, `AggregateRating`, `Service`) so pages cannot emit malformed markup.
- Site-wide `Organization` and `WebSite` JSON-LD in the root layout.
- A CI check asserting every registered URL returns 200 and every page emits exactly one canonical.

## Out of scope

The content of any page. Analytics (ticket 104). Lighthouse budgets (ticket 110) — that ticket consumes this.

## Files you own

`src/lib/seo.ts`, `src/lib/route-registry.ts`, `src/lib/jsonld.ts`, `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, the SEO CI check.

## Files you must NOT touch

Any `app/**/page.tsx` outside the ones listed. **After this ticket lands, no page ticket may edit `app/sitemap.ts` or `app/robots.ts`** — they register instead.

## Acceptance criteria

1. `pnpm build` and `pnpm typecheck` exit 0.
2. A test asserts every URL in the generated sitemap returns 200 and that the sitemap contains no URL whose robots metadata is `noindex`.
3. A test asserts every page emits exactly one canonical link and that it is absolute and built from `NEXT_PUBLIC_SITE_URL`.
4. A test with the Vercel environment set to `preview` asserts `robots.txt` disallows all, and with `production` asserts it allows crawling and references the sitemap.
5. A test asserts `buildMetadata()` output for a page with no explicit description still produces a non-empty description, so no page ships without one.
6. A test requests `/opengraph-image` and asserts a 200 with `content-type: image/png` and non-zero length.
7. A type test asserts each JSON-LD helper rejects a missing required property at compile time, via `@ts-expect-error` cases.
8. A test asserts adding a route to the registry causes it to appear in the sitemap without editing `app/sitemap.ts`.

## Blocked by

- 095 Scaffold atlure-web with Next 16 / the DS packages and the theme script
