---
id: "100"
title: "FAQ page with FAQPage structured data"
repo: atlure-web
epic: web-marketing
priority: P2
size: S
serialize: "No"
milestone: M5
blocked_by: "042 Web Card and Accordion; 095 Scaffold atlure-web with Next 16 / the DS packages and the theme script"
labels: "epic:web-marketing; type:page; area:seo"
---

# FAQ page with FAQPage structured data

## Context

The FAQ carries disproportionate SEO weight because `FAQPage` structured data can surface answers directly in search results, and it is the natural place to answer the two questions Atlure's model raises: how payment works (it does not — parents and sitters settle directly) and how sitters are verified. The accordion from ticket 042 keeps all answer text in the DOM while collapsed specifically so this markup is crawlable.

## Scope

- `/faq` rendering grouped questions for parents, sitters and general, using the `Accordion` from `@atlure/ui-web` in `multiple` mode.
- Question and answer content lives in a typed content module, not inline JSX, so it can be reused by the app's help screen later and kept in one place.
- `FAQPage` JSON-LD emitted from the same content module the page renders, so the markup and the visible text cannot diverge.
- Deep-linkable questions: each has a stable anchor and opening the page with a hash expands and scrolls to that question.
- Answers that must be accurate: no payment processing in v1, sitter verification status meaning, what data is stored and where (EU), cancellation expectations, and what Atlure does and does not guarantee.
- Reusable FAQ blocks for the city pages (ticket 098) sourced from the same module.

## Out of scope

The help-article system in the app (ticket 094). A CMS. Multilingual FAQ content — state the language decision on the ticket.

## Files you own

`app/faq/page.tsx`, `src/content/faq.ts`, `src/components/faq/**`.

## Files you must NOT touch

`src/lib/seo.ts` (ticket 101) — register the page through it. `packages/ui-web` in `atlure-ui` (ticket 042) — if the accordion needs a change, report there. `app/[country]/**` (ticket 098) — export the block for them to import.

## Acceptance criteria

1. `pnpm build` and `pnpm typecheck` exit 0.
2. A test asserts every answer string from `src/content/faq.ts` appears in the server-rendered HTML while all items are collapsed.
3. A test asserts the emitted `FAQPage` JSON-LD question and answer set is deeply equal to the content module's set — same count, same strings.
4. A test asserts the JSON-LD validates against `FAQPage` and that each `acceptedAnswer.text` is non-empty.
5. A test asserts loading `/faq#how-payment-works` expands that item and no other.
6. A test asserts the payment answer states that Atlure does not process payment, and that no answer claims insurance or a guarantee.
7. `axe` reports zero violations and a Playwright test confirms every question is reachable and toggleable by keyboard alone.

## Blocked by

- 042 Web Card and Accordion
- 095 Scaffold atlure-web with Next 16 / the DS packages and the theme script
