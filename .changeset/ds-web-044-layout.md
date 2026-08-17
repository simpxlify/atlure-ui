---
"@atlure/ui-web": minor
---

feat(ui-web): layout primitives — Section, Grid, Prose, VisuallyHidden, Row (ticket 044).

Adds the primitives the city-per-page marketing surface needs: `Section` (vertical rhythm + `tone` tokens + `as` for correct sectioning element), `Grid` (responsive `cols` prop translating `{ base: 1, md: 3 }` into `grid-cols-1 md:grid-cols-3`), `Prose` (typography wrapper for terms / privacy / help articles, tokenised without a Tailwind typography plugin), and `VisuallyHidden` (clip-path skip-link helper that keeps children in the DOM and a11y tree). `Container` gains the `size` variant (`prose` / `default` / `wide`). `Row` added as a horizontal `Stack` shortcut.
