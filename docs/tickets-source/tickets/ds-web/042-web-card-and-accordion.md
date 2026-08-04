---
id: "042"
title: "Web Card and Accordion"
repo: atlure-ui
epic: ds-web
priority: P1
size: S
serialize: "No"
milestone: M2
blocked_by: "019 Scaffold @atlure/ui-web sharing cva recipes with the native package; 029 Card family and Separator"
labels: "epic:ds-web; type:component"
---

# Web Card and Accordion

## Context

The marketing site's repeated shapes are the feature card, the sitter-profile card on indexable city pages, and the FAQ accordion. FAQ markup matters beyond looks: it is the source for `FAQPage` structured data, so the accordion must keep all answer text in the DOM rather than mounting it on expand, or search engines will not see it.

## Scope

- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` as DOM elements using the shared card recipe. `CardTitle` accepts an `as` prop so a page can choose the correct heading level for its outline.
- `Separator` rendering `<hr>` with `role="separator"`.
- `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` built on `<details>`/`<summary>` or an ARIA disclosure pattern. Content is always present in the DOM and hidden with CSS — never conditionally rendered.
- `single` and `multiple` modes, keyboard support (Enter/Space toggle, arrow keys move between triggers), and `aria-expanded` plus `aria-controls` wiring.
- Stories including a nine-item FAQ so the SEO ticket can lift the markup.

## Out of scope

The `FAQPage` JSON-LD itself — that belongs to the marketing page ticket that renders it (ticket 100). Any product UI. Editing shared recipes.

## Files you own

`packages/ui-web/src/components/card.tsx`, `separator.tsx`, `accordion.tsx`, `apps/storybook-web/stories/WebAccordion.stories.tsx`.

## Files you must NOT touch

`packages/ui/src/**`. `packages/ui-web/src/components/button.tsx` (ticket 041). `packages/ui-web/src/index.ts`.

## Acceptance criteria

1. `pnpm --filter @atlure/ui-web test` exits 0.
2. A test asserts every `AccordionContent` string is present in `container.textContent` while collapsed — the SEO-critical assertion.
3. A test asserts a collapsed trigger has `aria-expanded="false"` and its content is not exposed to the accessibility tree (`hidden` or `aria-hidden`), and that both flip on activation.
4. A test asserts `mode="single"` collapses the previously open item and `mode="multiple"` does not.
5. A test asserts `CardTitle as="h2"` renders an `H2` element.
6. `axe` reports zero violations on the Accordion story and keyboard-only traversal reaches every trigger, asserted by a Playwright test counting `Tab` stops.

## Blocked by

- 019 Scaffold @atlure/ui-web sharing cva recipes with the native package
- 029 Card family and Separator
