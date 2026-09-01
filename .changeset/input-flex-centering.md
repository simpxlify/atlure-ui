---
"@atlure/ui": patch
---

fix(input): restructure to a flex-centered wrapper so text truly sits in the middle

Previous attempts (paddingVertical: 0, includeFontPadding: false,
matching lineHeight to control height) fought font-metric bias, and the
lineHeight trick caused text to render below center or clip out of
view. Move the box styling — border, background, height, horizontal
padding — onto a wrapper View with `flex-row items-center`, and let a
plain TextInput fill it with `flex-1`. Vertical centering is now
flexbox-driven and platform-agnostic.

The variants export a new `inputTextClassName` for the inner
TextInput. `inputVariants` no longer carries `text-base`,
`text-foreground`, or the placeholder color — consumers who use
`inputVariants` on a text-carrying element (Picker, Select) already
style their inner text separately, so they're unaffected.
