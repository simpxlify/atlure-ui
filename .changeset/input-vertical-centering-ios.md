---
"@atlure/ui": patch
---

fix(input): also zero vertical padding on iOS for single-line Input

The Android-only fix from the previous patch fixed the caret drop on
Android but iOS TextInputs inside the fixed control heights were still
biasing text toward the bottom on some keyboard types (email address in
particular). Apply `paddingTop: 0, paddingBottom: 0` on iOS as well so
the caret and typed text sit in the vertical middle of the field on
both platforms. `includeFontPadding: false` remains Android-only.
