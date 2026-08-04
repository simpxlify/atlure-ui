---
id: "060"
title: Wire NativeWind / the token preset and NAV_THEME into atlure-paw
repo: atlure-paw
epic: paw-shell
priority: P0
size: M
serialize: "Yes"
milestone: M2
blocked_by: "058 Scaffold atlure-paw with expo-router and locked identifiers; 017 Publish @atlure/tailwind-preset with self-configuring content globs"
labels: "epic:paw-shell; type:scaffold; area:nativewind; serialize"
---

# Wire NativeWind / the token preset and NAV_THEME into atlure-paw

## Context

`@atlure/ui` ships untranspiled TypeScript so the consumer's Babel applies NativeWind's `jsxImportSource` transform. That means `atlure-paw` — not the design system — is responsible for the Babel preset, the Tailwind `content` globs, the `global.css` import and Metro's handling of a source-shipping dependency. Get any one wrong and `className` becomes a silently dead prop with no error. React Navigation 7 also requires `NAV_THEME` to carry a `fonts` key, which the salvaged theme omitted.

## Scope

- `tailwind.config.js` extending `@atlure/tailwind-preset` and nothing else — no local colours, no local scales.
- `babel.config.js` with `babel-preset-expo` configured for `jsxImportSource: "nativewind"` plus the NativeWind Babel preset, and the Reanimated plugin last.
- `global.css` importing the tokens' generated NativeWind CSS, imported once from the root layout.
- `metro.config.js` wrapped with `withNativeWind`, and `resolver`/`transformer` settings that transpile `@atlure/ui` and `@atlure/icons` from source rather than treating them as prebuilt.
- A `ThemeProvider` in the root layout using `NAV_THEME` from `@atlure/tokens` for React Navigation, wired to the device colour scheme with a user override persisted in `expo-secure-store`.
- Mount `PortalHost` from `@atlure/ui` (ticket 038) and `LocaleProvider` (ticket 032) in the root layout, plus `GestureHandlerRootView` and `SafeAreaProvider`.
- Status bar and navigation bar colours driven from tokens in both themes.
- A jest transform config so component tests in this repo see the same NativeWind transform.

## Out of scope

Proving it renders orange on hardware — that is ticket 061 and it is the real gate. Any screen. Editing the preset or tokens.

## Files you own

`tailwind.config.js`, `babel.config.js`, `metro.config.js`, `global.css`, `src/theme/theme-provider.tsx`, `app/_layout.tsx`, `jest.config.js`.

## Files you must NOT touch

`app/**` route files other than `_layout.tsx` (ticket 059). Anything in `atlure-ui` — if the preset's `content` globs are insufficient, report on ticket 017.

## Acceptance criteria

1. `npx expo export --platform ios` and `--platform android` both exit 0.
2. `grep -n "colors" tailwind.config.js` prints nothing — colours come only from the preset.
3. A jest render test of `Button` from `@atlure/ui` asserts the resolved style object contains a non-transparent `backgroundColor`, proving the NativeWind transform ran. A test that only asserts the `className` string is explicitly insufficient here.
4. A test asserts `NAV_THEME.light.fonts` and `NAV_THEME.dark.fonts` are defined at the point React Navigation consumes them.
5. A test asserts toggling the theme override persists across a simulated app restart by reading back from secure store.
6. `npx tsc --noEmit` exits 0 and `npx expo-doctor` reports no dependency-version issues.

## Blocked by

- 017 Publish @atlure/tailwind-preset with self-configuring content globs
- 058 Scaffold atlure-paw with expo-router and locked identifiers
