---
"@atlure/ui-web": minor
---

feat(ui-web): SEO-friendly Accordion, Separator, and CardTitle heading level (ticket 042).

- `Accordion` rewritten off `@radix-ui/react-accordion` onto a custom disclosure implementation that keeps every `AccordionContent` mounted in the DOM regardless of state — the marketing site's FAQ answers are the source for `FAQPage` structured data, so they must be crawlable even when collapsed. Collapsed content is hidden from users and the a11y tree via the `hidden` attribute; `aria-expanded` / `aria-controls` wired; keyboard support for Enter/Space toggle and Arrow / Home / End trigger navigation.
- `CardTitle` gains an `as` prop (`h1`–`h6`) so callers can pick the heading level for the page outline without dropping `asChild`.
- `Separator` renders `<hr role="separator">` with horizontal and vertical orientation, exposed for FAQ / feature-card list dividers.
