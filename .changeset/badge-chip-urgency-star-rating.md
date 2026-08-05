---
"@atlure/ui": minor
---

Add `Chip`, `UrgencyBadge` and `StarRating`, and extend `Badge` additively.

`Badge` keeps every existing variant and size and gains `default` (same output as `primary`),
`success`, `warning`, and size `default` (same output as `md`). Nothing was renamed or removed, so
existing callers are untouched — the duplication this leaves behind is tracked in issue #73.

`UrgencyBadge` maps `Urgency` onto badge variants through a `Record<Urgency, BadgeVariant>`, so the
mapping is exhaustive by construction: adding a member to the union is a typecheck failure rather than
a silent fallback.

`StarRating` renders full, half and empty stars for any fractional value, with `sm`/`md`/`lg` sizes, an
optional numeric readout, and an interactive mode that reports the pressed star for the leave-review
flow. Non-interactive ratings render no pressable at all and announce the score as a single label.

`Chip` is a selectable pill with an optional dismiss affordance that carries its own accessibility
label. The dismiss control is a sibling of the chip body rather than nested inside it, so the two never
render as nested buttons.
