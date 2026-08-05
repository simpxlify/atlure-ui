---
"@atlure/ui": minor
---

Add the `Sheet` primitive with `Select` and `Picker` built on top of it.

`Sheet` is a bottom sheet over React Native's `Modal`, so it escapes parent clipping and renders
above the tab bar without a portal. It has a backdrop that closes on press, drag-to-dismiss with
configurable `snapPoints`, an Android hardware-back handler that marks the event handled, and it
skips the slide animation when the OS reduced-motion setting is on.

`Select` is a trigger styled with the shared input recipe that opens a sheet of options with a check
mark on the selected one. It is generic over the option value type and uses `NoInfer` so a value
outside the declared option union fails to typecheck rather than silently widening it. `Picker` is
the multi-select variant returning an array.

`useSheet()` exposes imperative `open`, `close` and `toggle` for screens that trigger a sheet from a
header action.
