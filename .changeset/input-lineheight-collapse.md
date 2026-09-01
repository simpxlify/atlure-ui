---
"@atlure/ui": patch
---

fix(input): tighten TextInput lineHeight so the visible text truly centers

Root cause analysis: `text-base` in the tailwind preset expands to `{ fontSize:
16, lineHeight: 24 }`. Inside a fixed-height wrapper on Android, gravity centers
the 24px line box in the container — but the glyph inside that line box is drawn
at the font baseline, which places it in the lower portion of the line box.
Result: the caret sits at container center (the natural center of the line box)
but the visible text appears below.

Fix: override the tailwind `lineHeight: 24` with `lineHeight: 18` on the
TextInput style (fontSize × ~1.15, still enough room for descenders). The line
box is now nearly equal to the glyph height, so the baseline-drawn glyph
occupies the whole line box and its visible center IS the container center on
both platforms.
