# @atlure/ui-web

## 0.8.0

### Patch Changes

- Updated dependencies []:
  - @atlure/tailwind-preset@0.8.0

## 0.7.0

### Patch Changes

- Updated dependencies []:
  - @atlure/tailwind-preset@0.7.0

## 0.6.1

### Patch Changes

- [#93](https://github.com/simpxlify/atlure-ui/pull/93) [`4aff69e`](https://github.com/simpxlify/atlure-ui/commit/4aff69ee704be592cbd10bcc733709dd35b165c3) Thanks [@simpxlify](https://github.com/simpxlify)! - chore(ui-web): drop `@radix-ui/react-accordion` from runtime dependencies.

  Ticket 042 replaced the Radix-based Accordion with a native `<details>` implementation for SEO reasons, so the runtime dependency has been dead code since 0.6.0. Removing it shrinks the install size and removes one third-party surface from the consumer graph.

- [#92](https://github.com/simpxlify/atlure-ui/pull/92) [`4ff39e8`](https://github.com/simpxlify/atlure-ui/commit/4ff39e87127947e607bac31f7923cc2b13105d34) Thanks [@simpxlify](https://github.com/simpxlify)! - feat(ui-web): expose `themeScript` and helpers via `@atlure/ui-web/theme-script` subpath.

  The main barrel eagerly evaluates `ThemeProvider`, which calls `createContext(...)` at module scope and blows up in React Server Components. The `themeScript` string is now reachable via a dedicated subpath entry that is safe to import from a Next 16 `app/layout.tsx` (server component) without pulling any client-only surface. Same exports (`themeScript`, `THEME_STORAGE_KEY`, `THEME_CLASS`, `readStoredTheme`, `systemTheme`, `resolveTheme`, `applyThemeClass`, `applyStoredTheme`, `Theme`, `ResolvedTheme`) — the main barrel keeps re-exporting them unchanged.

- Updated dependencies []:
  - @atlure/tailwind-preset@0.6.1

## 0.6.0

### Minor Changes

- [#87](https://github.com/simpxlify/atlure-ui/pull/87) [`c55f2ac`](https://github.com/simpxlify/atlure-ui/commit/c55f2ac2a98344a9f2b1cf5d3f074e9e70af4283) Thanks [@simpxlify](https://github.com/simpxlify)! - feat(ui-web): IconButton mirroring the native @atlure/ui counterpart (ticket 041).

  Adds a square `<button>` at `size="icon"` from the shared button recipe with a required `aria-label`, spinner-swap `isLoading` state (also flips `aria-busy` and `disabled`), and the same `type="button"` default the wave-6 form-submit fix already applied to `Button`. Also adds Badge unit tests and a Storybook page for the icon variant alongside the existing Button and Badge stories.

- [#88](https://github.com/simpxlify/atlure-ui/pull/88) [`42d1f98`](https://github.com/simpxlify/atlure-ui/commit/42d1f98186ad9d38c738e9d5ee004b2a0551105c) Thanks [@simpxlify](https://github.com/simpxlify)! - feat(ui-web): SEO-friendly Accordion, Separator, and CardTitle heading level (ticket 042).

  - `Accordion` rewritten off `@radix-ui/react-accordion` onto a custom disclosure implementation that keeps every `AccordionContent` mounted in the DOM regardless of state — the marketing site's FAQ answers are the source for `FAQPage` structured data, so they must be crawlable even when collapsed. Collapsed content is hidden from users and the a11y tree via the `hidden` attribute; `aria-expanded` / `aria-controls` wired; keyboard support for Enter/Space toggle and Arrow / Home / End trigger navigation.
  - `CardTitle` gains an `as` prop (`h1`–`h6`) so callers can pick the heading level for the page outline without dropping `asChild`.
  - `Separator` renders `<hr role="separator">` with horizontal and vertical orientation, exposed for FAQ / feature-card list dividers.

- [#89](https://github.com/simpxlify/atlure-ui/pull/89) [`b89bac9`](https://github.com/simpxlify/atlure-ui/commit/b89bac9b78d2984531d1f4629ff80fe6a025098b) Thanks [@simpxlify](https://github.com/simpxlify)! - feat(ui-web): layout primitives — Section, Grid, Prose, VisuallyHidden, Row (ticket 044).

  Adds the primitives the city-per-page marketing surface needs: `Section` (vertical rhythm + `tone` tokens + `as` for correct sectioning element), `Grid` (responsive `cols` prop translating `{ base: 1, md: 3 }` into `grid-cols-1 md:grid-cols-3`), `Prose` (typography wrapper for terms / privacy / help articles, tokenised without a Tailwind typography plugin), and `VisuallyHidden` (clip-path skip-link helper that keeps children in the DOM and a11y tree). `Container` gains the `size` variant (`prose` / `default` / `wide`). `Row` added as a horizontal `Stack` shortcut.

- [#90](https://github.com/simpxlify/atlure-ui/pull/90) [`f54782c`](https://github.com/simpxlify/atlure-ui/commit/f54782c6a9049a513311b8be46a79510e2aacbd9) Thanks [@simpxlify](https://github.com/simpxlify)! - feat(ui-web): ThemeProvider, dark-mode blocking script, feedback states (ticket 045).

  - `ThemeProvider` reads a persisted preference (or `prefers-color-scheme`), exposes `theme` / `resolvedTheme` / `setTheme` via `useTheme`, and writes the choice to `localStorage`. Reacts to system-preference changes when the stored value is `system`.
  - `themeScript` — a blocking inline snippet exported as a string. Consuming apps inject it into `<head>` so the `dark` class lands on `<html>` before first paint, killing the flash-of-light. `atlure-web` picks this up in ticket 095.
  - `ThemeToggle` — button with an `aria-label` that flips with the target state and `aria-pressed` reflecting the current mode.
  - `Skeleton`, `EmptyState`, `ErrorState` — web render layers matching the native family from wave-6 PR #65.
  - README documents the token CSS import path and the blocking-script wiring.

### Patch Changes

- Updated dependencies []:
  - @atlure/tailwind-preset@0.6.0

## 0.5.0

### Patch Changes

- Updated dependencies [[`bead6ab`](https://github.com/simpxlify/atlure-ui/commit/bead6ab0c6a1563a1f62a0d89a05c35ea7f71cfa)]:
  - @atlure/tailwind-preset@0.5.0

## 0.4.0

### Patch Changes

- Updated dependencies [[`d5a9526`](https://github.com/simpxlify/atlure-ui/commit/d5a9526e0d5ebfff45f20eb525849b0f9c073350)]:
  - @atlure/tailwind-preset@0.4.0

## 0.3.0

### Minor Changes

- [#62](https://github.com/simpxlify/atlure-ui/pull/62) [`2dbd220`](https://github.com/simpxlify/atlure-ui/commit/2dbd220a49b999b63441a6aded7178a7cdcfe29e) Thanks [@simpxlify](https://github.com/simpxlify)! - Add `IconButton`, a `link` variant and an `icon` size to the native `Button`, and wire its label colour through `TextClassProvider` so nested `Text` inherits it instead of each caller repeating classes.

  Adding `icon` to native closes a real parity divergence: web already had it and the gap was sitting in the parity test's allow-list, which is now empty for `button`. `link` was added to both platforms in the same shape — underlined on native, which has no `hover:`.

  **Fixes a defect in the web `Button`:** it never set `type`, so it defaulted to `submit` and any `Button` inside a `form` submitted it on click. It now defaults to `type="button"`, and a caller passing `type="submit"` still wins.

### Patch Changes

- Updated dependencies []:
  - @atlure/tailwind-preset@0.3.0

## 0.2.0

### Minor Changes

- [`3d44338`](https://github.com/simpxlify/atlure-ui/commit/3d443385f8ab518c7399160e1128af3ce341457e) Thanks [@simpxlify](https://github.com/simpxlify)! - Initial release of the Atlure design system.

  `@atlure/tokens` is the single source of truth for colour, radius, spacing and type scales, generating the web CSS variables, the NativeWind stylesheet, the Tailwind preset, the React Native theme object and `NAV_THEME` from one file. `@atlure/types` carries the domain model. `@atlure/ui` provides eleven React Native components, shipped as untranspiled source so NativeWind's babel transform can apply. `@atlure/ui-web` provides the DOM component set the marketing site needs, with a parity test enforcing a consistent API surface across both platforms.

- [#3](https://github.com/simpxlify/atlure-ui/pull/3) [`41015d6`](https://github.com/simpxlify/atlure-ui/commit/41015d6b86d107b3c387e898cebb027ed388cad5) Thanks [@simpxlify](https://github.com/simpxlify)! - Add `@atlure/ui-web`: Button, Card, Badge, Input, Accordion and the Container/Stack layout
  primitives for the marketing surface, built on Radix primitives.

  Web and native deliberately keep separate cva recipes, because React Native has no CSS
  pseudo-classes, no text style inheritance and no `inline-flex`. A parity test enforces the shared
  API surface instead, so variant and size option names cannot drift between platforms.

### Patch Changes

- Updated dependencies [[`3d44338`](https://github.com/simpxlify/atlure-ui/commit/3d443385f8ab518c7399160e1128af3ce341457e)]:
  - @atlure/tailwind-preset@0.2.0
