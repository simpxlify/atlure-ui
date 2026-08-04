---
id: "019"
title: Scaffold @atlure/ui-web sharing cva recipes with the native package
repo: atlure-ui
epic: ds-foundations
priority: P1
size: S
serialize: "Yes"
milestone: M2
blocked_by: "018 Scaffold @atlure/ui as a source-shipping package"
labels: "epic:ds-foundations; type:package; serialize"
---

# Scaffold @atlure/ui-web sharing cva recipes with the native package

## Context

`atlure-web` is marketing and SEO only — no product screens — so `@atlure/ui-web` needs roughly ten DOM components, not parity with the native set. The cva variant recipes are **shared** with `@atlure/ui` (NativeWind accepts Tailwind class strings on RN components), so what diverges per platform is only the render layer, about fifteen lines per component.

## Scope

- Create `packages/ui-web` publishing `@atlure/ui-web`.
- It imports variant recipes from `@atlure/ui`'s recipe subpath. Recipes are the shared artifact; **do not fork them**.
- `react` and `react-dom` are peerDependencies. `@atlure/types` and `@atlure/tailwind-preset` are dependencies.
- Ships source, consistent with `@atlure/ui`. `files: ["src", "README.md"]`.
- No `react-native` dependency of any kind, direct or transitive.
- README stating the package is marketing-surface only and that product UI belongs in `@atlure/ui`.

## Out of scope

Any component — epic `ds-web`. Next.js integration in `atlure-web` (ticket 095).

## Files you own

`packages/ui-web/package.json`, `tsconfig.json`, `README.md`, `src/lib/`.

## Files you must NOT touch

`packages/ui/src/lib/recipes/**` — read-only from here; if a recipe needs changing, that is a `ds-native` ticket. `packages/tokens/**`, `packages/tailwind-preset/**`. Do not hand-write `src/index.ts` (ticket 020).

## Acceptance criteria

1. `pnpm --filter @atlure/ui-web typecheck` exits 0.
2. `pnpm --filter @atlure/ui-web ls --depth 10 react-native` reports no match, proving no RN leaks into the web package.
3. `grep -rn "from \"react-native\"" packages/ui-web/src` prints nothing.
4. `grep -rn "recipes" packages/ui-web/src/lib` shows the import resolving to `@atlure/ui`, not a local copy; `ls packages/ui-web/src/lib/recipes` fails with no such file.
5. `cd packages/ui-web && npm pack --dry-run --json` lists only `src/`, `package.json` and `README.md`.

## Blocked by

- 018 Scaffold @atlure/ui as a source-shipping package
