---
"@atlure/ui-web": minor
---

feat(ui-web): ThemeProvider, dark-mode blocking script, feedback states (ticket 045).

- `ThemeProvider` reads a persisted preference (or `prefers-color-scheme`), exposes `theme` / `resolvedTheme` / `setTheme` via `useTheme`, and writes the choice to `localStorage`. Reacts to system-preference changes when the stored value is `system`.
- `themeScript` — a blocking inline snippet exported as a string. Consuming apps inject it into `<head>` so the `dark` class lands on `<html>` before first paint, killing the flash-of-light. `atlure-web` picks this up in ticket 095.
- `ThemeToggle` — button with an `aria-label` that flips with the target state and `aria-pressed` reflecting the current mode.
- `Skeleton`, `EmptyState`, `ErrorState` — web render layers matching the native family from wave-6 PR #65.
- README documents the token CSS import path and the blocking-script wiring.
