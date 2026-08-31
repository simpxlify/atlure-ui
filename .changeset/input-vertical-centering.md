---
"@atlure/ui": patch
---

fix(input): vertically center text inside single-line Input on Android

The fixed control heights (`h-control-sm/md/lg`) plus RN's default
`includeFontPadding` and top-biased vertical alignment pushed the caret
and typed text below the vertical middle of the field on Android. The
Input now sets `textAlignVertical="center"` on single-line variants and
zeroes vertical padding + turns off `includeFontPadding` on Android so
the text sits in the middle of the box. Multiline inputs still start
at the top.
