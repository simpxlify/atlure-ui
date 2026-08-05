---
"@atlure/ui": minor
---

Add `Progress`, determinate and indeterminate.

A determinate bar takes `value` 0-100, clamps anything outside that, and reports `min`, `max` and
`now` to screen readers. An indeterminate bar announces itself busy with no current value and loops a
sliding fill, which stops as soon as the OS reduced-motion setting is known to be on.

Also lands the value logic the sliders will sit on — snap-to-step, position/value conversion and the
non-crossing range guard — as internal modules with tests. `Slider` and `RangeSlider` themselves are
not in this change.
