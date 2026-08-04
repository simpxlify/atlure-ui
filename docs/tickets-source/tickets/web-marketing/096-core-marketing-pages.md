---
id: "096"
title: "Core marketing pages: home / how it works / for sitters"
repo: atlure-web
epic: web-marketing
priority: P1
size: M
serialize: "No"
milestone: M4
blocked_by: "095 Scaffold atlure-web with Next 16 / the DS packages and the theme script; 044 Web layout primitives: Container / Section / Stack / Grid / Prose"
labels: "epic:web-marketing; type:page"
---

# Core marketing pages: home / how it works / for sitters

## Context

These are the three pages a visitor actually reads: what Atlure is, how a booking works, and why a sitter should join. Atlure covers pet sitting, dog walking and home boarding, EU-wide, and **takes no cut in v1** — parents and sitters settle between themselves. The copy must not promise payment handling, insurance or guarantees the product does not provide.

## Scope

- Home: hero with the value proposition and app download call to action, the three service kinds, how-it-works summary, trust signals that are actually true today, a city links section feeding the programmatic pages, and a closing call to action.
- How it works: separate parent and sitter journeys, each as a numbered sequence, plus a short section stating plainly that Atlure does not process payment and that arrangements are made directly.
- For sitters: what a sitter can offer, how requests reach them, the verification process, and a waitlist or signup call to action.
- All three are server-rendered static pages with no client JavaScript beyond the theme toggle.
- Components come from `@atlure/ui-web` and the layout primitives; no bespoke section styling.
- Responsive from 320 px up, with no horizontal overflow at any width.
- Every image uses `next/image` with explicit dimensions and meaningful alt text. Brand imagery is a placeholder pending ticket 109 — never ship an asset that says "pawlii".

## Out of scope

Programmatic city pages (ticket 098), sitter profile pages (ticket 099), FAQ (ticket 100), legal (ticket 097), forms (ticket 102). Per-page metadata beyond a title and description — the metadata system is ticket 101.

## Files you own

`app/page.tsx`, `app/how-it-works/page.tsx`, `app/for-sitters/page.tsx`, `src/components/marketing/**`.

## Files you must NOT touch

`app/layout.tsx`, `src/components/site-header.tsx`, `site-footer.tsx` (ticket 095). Other page directories.

## Acceptance criteria

1. `pnpm build` and `pnpm typecheck` exit 0.
2. A test asserts each of the three routes returns 200 and renders exactly one `h1`.
3. A test asserts the heading outline on each page has no skipped levels, by walking the rendered heading elements.
4. `grep -riE "insurance|guaranteed|we handle payment|secure payment|escrow" app src/components/marketing` prints nothing.
5. `grep -rin "pawlii" app src public` prints nothing.
6. A Playwright test at viewport widths 320, 768 and 1440 asserts `document.documentElement.scrollWidth` equals the viewport width on all three pages.
7. A test asserts every `next/image` usage has non-empty `alt` and explicit `width` and `height`.
8. `axe` reports zero violations on all three pages.

## Blocked by

- 044 Web layout primitives: Container / Section / Stack / Grid / Prose
- 095 Scaffold atlure-web with Next 16 / the DS packages and the theme script
