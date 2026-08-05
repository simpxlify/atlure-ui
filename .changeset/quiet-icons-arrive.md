---
"@atlure/icons": minor
---

Add `@atlure/icons`, a single lucide import path for both surfaces. The `react-native` export condition resolves to `lucide-react-native` and everything else to `lucide-react`, so screens import `{ Heart }` without knowing which platform they are on.

The icon set is a closed, generated list rather than a re-export of all of lucide. The native entry imports one module per icon because Metro does not tree-shake lucide's 6000-icon barrel, and registers a NativeWind `cssInterop` mapping so `className` tints a glyph through lucide's `color` prop.
