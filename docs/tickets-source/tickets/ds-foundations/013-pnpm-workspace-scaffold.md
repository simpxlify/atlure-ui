---
id: "013"
title: Scaffold the atlure-ui pnpm workspace with pinned dependencies
repo: atlure-ui
epic: ds-foundations
priority: P0
size: M
serialize: "Yes"
milestone: M1
blocked_by: "002 Create and clone the four atlure repos"
labels: "epic:ds-foundations; type:scaffold; serialize"
---

# Scaffold the atlure-ui pnpm workspace with pinned dependencies

## Context

`atlure-ui` is the design system repo: a pnpm workspace that publishes `@atlure/tokens`, `@atlure/tailwind-preset`, `@atlure/types`, `@atlure/ui` (native) and `@atlure/ui-web` (DOM), plus a never-published Storybook app. Its predecessor shipped 28 npm versions in 16 days with no CI, no tests and a broken `exports` map. This ticket lays the workspace skeleton and front-loads every dependency so later tickets never touch `pnpm-lock.yaml`.

`packages/tokens` is **already being written by the lead** — do not create, move or edit it.

## Scope

- `pnpm-workspace.yaml` with `packages/*` and `apps/*`.
- Root `package.json` (private, no version) with scripts `build`, `test`, `typecheck`, `lint`, and `packageManager` pinned to the pnpm version in use.
- Root `tsconfig.base.json`: `strict`, `moduleResolution: "bundler"`, `jsx: "react-jsx"`, no `allowJs`.
- Root `.npmrc` with `save-exact=true` and `strict-peer-dependencies=false` (NativeWind declares no RN peer; see ticket 061).
- Empty `packages/{types,ui,ui-web,tailwind-preset}` and `apps/storybook-web` directories with a `.gitkeep` each — the per-package tickets fill them.
- Front-load exact dev dependencies at the root: `typescript`, `vitest`, `eslint`, `prettier`, `publint`, `@arethetypeswrong/cli`, `tailwindcss@3.4.19`, `nativewind@4.2.6`, `react@19.2.0`, `react-native@0.86.2`, `expo@57.0.10`.
- `AGENTS.md` stating the agent-safety rules: no cross-package deep imports; RN-safe Tailwind subset only in shared cva recipes (no `space-x-*`, `divide-*`, `grid`, no descendant selectors); a changeset is required for any `packages/*` change; never `npm publish` locally; never hand-edit generated token files or `pnpm-lock.yaml`.

## Out of scope

`packages/tokens` in any form. Any component. Any CI workflow (tickets 022, 023). Storybook config (ticket 025).

## Files you own

`pnpm-workspace.yaml`, `package.json`, `pnpm-lock.yaml`, `tsconfig.base.json`, `.npmrc`, `AGENTS.md`, `.gitkeep` files.

## Files you must NOT touch

`packages/tokens/**` — owned by the lead and frozen. Anything outside `atlure-ui`.

## Acceptance criteria

1. `pnpm install --frozen-lockfile` exits 0 from a clean clone.
2. `pnpm -r exec node -e "process.exit(0)"` exits 0, proving every workspace package resolves.
3. `pnpm ls -r --depth 0 tailwindcss nativewind expo react-native` prints exactly `3.4.19`, `4.2.6`, `57.0.10`, `0.86.2` with no additional versions.
4. `git status --porcelain packages/tokens` prints nothing.
5. `AGENTS.md` exists and contains the literal strings `never npm publish locally` and `pnpm-lock.yaml`.

## Blocked by

- 002 Create and clone the four atlure repos
