---
id: "058"
title: Scaffold atlure-paw with expo-router and locked identifiers
repo: atlure-paw
epic: paw-shell
priority: P0
size: M
serialize: "Yes"
milestone: M2
blocked_by: "002 Create and clone the four atlure repos"
labels: "epic:paw-shell; type:scaffold; serialize"
---

# Scaffold atlure-paw with expo-router and locked identifiers

## Context

`atlure-paw` is the product: mobile-first, all 25 screens. Its identity must be set once and never changed, because bundle ids are permanent after store submission and a future companion app must reuse the same published `@atlure/*` packages without any of them hardcoding "paw". The predecessor's `app.json` also had a trailing comma in its `ios` block and was invalid JSON, so this repo uses a typed `app.config.ts` instead.

## Scope

- Expo 57.0.10 / RN 0.86.2, `expo-router` for file-based routing, TypeScript strict.
- `app.config.ts` (not `app.json`) with: slug `atlure-paw`, name `Atlure`, `ios.bundleIdentifier` and `android.package` both `com.atlure.paw`, scheme `atlure`, `ios.associatedDomains: ["applinks:www.atlure.com"]`, `newArchEnabled: true`.
- Hermes with `Intl` enabled — `MoneyLabel` and `DateLabel` from `@atlure/ui` depend on `Intl.NumberFormat` and `Intl.DateTimeFormat` with non-English locales.
- A **new** EAS project (`eas init`), never the old `pawlii` one. `eas.json` with `development`, `preview` and `production` profiles.
- Front-load every dependency the design system declares as a peer: `nativewind@4.2.6`, `tailwindcss@3.4.19`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-svg`, `react-native-safe-area-context`, `react-native-screens`, `@supabase/supabase-js@2.112.0`, `react-native-maps`, `expo-secure-store`, `expo-image-picker`, `expo-location`, `expo-notifications`.
- `metro.config.js` with `watchFolders` pointing at a local `atlure-ui` checkout when `ATLURE_UI_PATH` is set, so design-system work does not require a publish cycle.
- `AGENTS.md`: never `npm publish`; use `pnpm overrides` or `ATLURE_UI_PATH` for local DS work; declare new dependencies on the ticket instead of adding them ad hoc; no raw hex colours; navigation config is edited one word at a time (ticket 059).

## Out of scope

Any screen. NativeWind wiring (ticket 060) and the device proof (ticket 061). Auth (ticket 062). Store submission (ticket 111).

## Files you own

`app.config.ts`, `eas.json`, `package.json`, `tsconfig.json`, `metro.config.js`, `babel.config.js`, `.gitignore`, `AGENTS.md`, `app/_layout.tsx` as a bare placeholder.

## Files you must NOT touch

Anything in `atlure-ui`, `atlure-api` or `atlure-web`. Do not touch the old `pawlii` repo. Do not reuse EAS project id `287453d9-1ce7-4655-a01b-bda810a6598f`.

## Acceptance criteria

1. `npx expo config --type public --json` exits 0 and reports slug `atlure-paw`, name `Atlure`, scheme `atlure`, and `com.atlure.paw` for both `ios.bundleIdentifier` and `android.package`.
2. `grep -rn "pawlii\|simpxlify.pawlii" app.config.ts eas.json` prints nothing.
3. `npx tsc --noEmit` exits 0.
4. `eas project:info` reports a project id different from `287453d9-1ce7-4655-a01b-bda810a6598f`.
5. `node -e "new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(1)"` run in the Hermes bundle context returns a string containing `€` — asserted by a jest test that fails if `Intl` is stripped.
6. `ATLURE_UI_PATH=../atlure-ui npx expo start --no-dev --minify` starts without a resolution error, and unset it resolves from `node_modules` instead.

## Blocked by

- 002 Create and clone the four atlure repos
