---
"@atlure/tokens": minor
"@atlure/tailwind-preset": minor
"@atlure/ui": minor
---

Add `textareaHeight` token group keyed by row count (2/3/4/6), derived from `lineHeight.base` plus twice `spacing.sm`. Textarea `rows` variant now consumes `min-h-textarea-{rows}` classes in place of the stopgap `min-h-16 / 24 / 28 / 40` (ui #66).
