---
"@atlure/ui": patch
---

fix(input): set lineHeight equal to the control height so text truly sits in the middle

Even with `textAlignVertical="center"` + `paddingVertical: 0` +
`includeFontPadding: false`, the system font's baseline metrics left
the typed text visually biased below the geometric middle of a fixed
`h-control-*` height. Set `lineHeight` per size (sm: 36, md: 40, lg:
48) on the TextInput so the glyph box fills the container height and
the text sits in the true vertical middle on both iOS and Android.
Multiline inputs are unaffected.
