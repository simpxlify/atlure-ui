---
id: "026"
title: "@atlure/icons: one lucide wrapper for native and web"
repo: atlure-ui
epic: ds-native
priority: P0
size: S
serialize: "No"
milestone: M2
blocked_by: "018 Scaffold @atlure/ui as a source-shipping package"
labels: "epic:ds-native; type:package; area:icons"
---

# @atlure/icons: one lucide wrapper for native and web

## Context

The prototype imports icons directly from `lucide-react` in every screen (`Heart, Star, MapPin, Clock, Calendar, User, Trash2` and dozens more). Native needs `lucide-react-native`, web needs `lucide-react`, and screens must not know which. A thin `@atlure/icons` package with a platform-conditional `exports` map gives one import path across both, and avoids `@expo/vector-icons`, whose glyph set does not match the prototype.

## Scope

- New workspace package `packages/icons` publishing `@atlure/icons`.
- `exports` with `"react-native"` and `"default"` conditions resolving to the native and DOM entry respectively.
- Re-export the icon set the 25 screens actually use — enumerate by grepping the prototype rather than re-exporting all of lucide, so the tarball stays small.
- A shared `IconProps` type: `size` defaulting to the token scale, `className` for colour via NativeWind, `strokeWidth` defaulting to 2.
- `lucide-react` and `lucide-react-native` as dependencies; `react`, `react-native` and `react-native-svg` as peers.
- Native path requires `react-native-svg`; document it as a peer the consumer app must install.

## Out of scope

Custom Atlure-drawn icons or the logo mark — those are brand assets and require a human (ticket 109). Any screen usage.

## Files you own

`packages/icons/**`, plus the `packages/icons/pack-manifest.txt` entry.

## Files you must NOT touch

`packages/ui/**`, `packages/tokens/**`, `packages/tailwind-preset/**`. Do not hand-edit `src/index.ts` — extend `scripts/generate-barrels.mjs` inputs if needed and say so on the ticket.

## Acceptance criteria

1. `pnpm --filter @atlure/icons typecheck` exits 0.
2. `node --conditions=react-native -e "require('@atlure/icons')"` resolves to the native entry and `node -e "require('@atlure/icons')"` resolves to the DOM entry, both without throwing.
3. `npx attw --pack packages/icons` exits 0.
4. Every icon name used in the prototype resolves: a test iterates a committed list of names extracted from `atlure-spec-reference` and asserts each is a defined export from both entries.
5. `grep -rn "lucide-react" packages/ui/src` prints nothing, proving screens and components go through `@atlure/icons`.

## Blocked by

- 018 Scaffold @atlure/ui as a source-shipping package
