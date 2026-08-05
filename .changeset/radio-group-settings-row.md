---
"@atlure/ui": minor
---

Add `RadioGroup` / `RadioGroupItem` and `SettingsRow`, and complete the selection controls.

`RadioGroup` shares its selected value through context and moves selection with the arrow keys on
web, wrapping at both ends. `SettingsRow` is the labelled title/description row with a trailing
control slot used by the notification, security and privacy screens, and it labels the control region
with the row title so a bare `Switch` is never announced without a name.

`Checkbox` gains an `isIndeterminate` state that reports `mixed` to assistive technology and resolves
to checked when pressed, and now draws its mark with the `Check` and `Minus` icons instead of a plain
filled box. `Switch` gains a `size` variant and animates the thumb between ends.

Touch targets are now derived from each control's real geometry: `touchTargetHitSlopForSize` pads a
control from its actual rendered size, so the 24dp checkbox and radio and the 28dp switch track all
reach the 44dp minimum. They previously computed hit slop from the 40dp control-height token and
resolved to 28-32dp.

`checkboxBoxVariants` renames its `isChecked` variant to `isSelected`, since the box is filled for
both the checked and indeterminate states, and `checkboxIndicatorVariants` is removed now that the
indicator is an icon.
