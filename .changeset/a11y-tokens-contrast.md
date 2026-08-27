---
"@atlure/tokens": patch
"@atlure/tailwind-preset": patch
"@atlure/ui": patch
"@atlure/ui-web": patch
---

Fix WCAG AA color-contrast on primary, destructive, and muted token pairs. `primaryForeground` (light + dark) is now `slate900` on `orange600` (5.30:1). `destructiveForeground` (dark) is `slate900` on `red500` (4.88:1) — white was only 3.74:1. `mutedForeground` (dark) is `slate300` on `slate700` (6.90:1). Brand `primary` orange (`#ea580c`) is unchanged. Adds `slate300` to the palette for the muted-dark tier. Fixes ui #112.
