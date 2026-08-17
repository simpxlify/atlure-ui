---
"@atlure/ui-web": patch
---

feat(ui-web): expose `themeScript` and helpers via `@atlure/ui-web/theme-script` subpath.

The main barrel eagerly evaluates `ThemeProvider`, which calls `createContext(...)` at module scope and blows up in React Server Components. The `themeScript` string is now reachable via a dedicated subpath entry that is safe to import from a Next 16 `app/layout.tsx` (server component) without pulling any client-only surface. Same exports (`themeScript`, `THEME_STORAGE_KEY`, `THEME_CLASS`, `readStoredTheme`, `systemTheme`, `resolveTheme`, `applyThemeClass`, `applyStoredTheme`, `Theme`, `ResolvedTheme`) — the main barrel keeps re-exporting them unchanged.
