---
"@atlure/tokens": minor
"@atlure/tailwind-preset": minor
---

Add `success` and `warning` semantic colors, with their `-foreground` twins.

The palette gains green and amber/yellow entries, and both themes map them the way `destructive`
already does: a deeper shade in light mode and a lighter one in dark, so the semantic reads as an
accent against either background. `bg-success`, `text-success-foreground`, `bg-warning` and
`text-warning-foreground` become available to every consumer of the Tailwind preset.

This unblocks the Badge `success` / `warning` variants and the Toast `success` variant, both of which
previously had no token to paint from.
