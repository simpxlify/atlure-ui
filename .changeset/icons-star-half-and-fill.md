---
"@atlure/icons": minor
---

Add the `StarHalf` icon and a `fill` prop to `IconProps`.

A star rating needs three states — full, half and empty — and only the outline `Star` existed. lucide
has no separate filled-star icon; the sanctioned way to fill any lucide glyph is the SVG `fill`
attribute, so `IconProps` now carries `fill?: string` alongside `color`. `<Star fill="currentColor" />`
renders a solid star, and `StarHalf` covers the half step.

`fill` works on every icon in the set, not just stars, so any glyph can be rendered solid without a
second asset.
