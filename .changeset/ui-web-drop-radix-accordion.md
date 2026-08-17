---
"@atlure/ui-web": patch
---

chore(ui-web): drop `@radix-ui/react-accordion` from runtime dependencies.

Ticket 042 replaced the Radix-based Accordion with a native `<details>` implementation for SEO reasons, so the runtime dependency has been dead code since 0.6.0. Removing it shrinks the install size and removes one third-party surface from the consumer graph.
