---
id: "021"
title: Configure changesets with a fixed version group across @atlure/*
repo: atlure-ui
epic: ds-foundations
priority: P0
size: S
serialize: "Yes"
milestone: M1
blocked_by: "013 Scaffold the atlure-ui pnpm workspace with pinned dependencies"
labels: "epic:ds-foundations; type:tooling; area:release; serialize"
---

# Configure changesets with a fixed version group across @atlure/*

## Context

The predecessor produced 28 npm versions in 16 days with no changelog and no release process, because the design system and its consumer lived in separate repos and every fix meant a manual publish. Changesets makes version bumps and changelogs mechanical. A **`fixed` version group** across all `@atlure/*` packages means every package moves together, so the question "which `@atlure/tokens` version does `@atlure/ui@0.4` need" never arises — a real problem with a polyrepo where consumers pin by range.

## Scope

- `pnpm add -Dw @changesets/cli` and `pnpm changeset init`.
- `.changeset/config.json`: `access: "public"`, `baseBranch: "main"`, `fixed: [["@atlure/tokens","@atlure/tailwind-preset","@atlure/types","@atlure/ui","@atlure/ui-web"]]`, `ignore: ["storybook-web"]`.
- `updateInternalDependencies: "patch"` so intra-workspace ranges bump.
- A CI job asserting any PR touching `packages/*` contains at least one changeset file, with an escape hatch label `no-changeset` for pure test/docs changes.
- Document the flow in `AGENTS.md`: a changeset is required for any `packages/*` change, and no agent ever runs `npm publish`.

## Out of scope

The publishing workflow itself (ticket 022). Actually publishing anything.

## Files you own

`.changeset/**`, root `package.json` devDependency entry, `.github/workflows/changeset-check.yml`, the changeset section of `AGENTS.md`.

## Files you must NOT touch

`.github/workflows/release.yml` — ticket 022. Any package source. `packages/tokens/**`.

## Acceptance criteria

1. `node -e "const c=require('./.changeset/config.json'); if(c.fixed[0].length!==5) process.exit(1)"` exits 0.
2. `node -e "const c=require('./.changeset/config.json'); if(c.access!=='public') process.exit(1)"` exits 0.
3. `pnpm changeset status --since=main` exits 0 on a clean tree.
4. Open a scratch PR touching `packages/ui/src/lib/cn.ts` with no changeset and confirm the `changeset-check` job fails; add a changeset and confirm it passes.
5. `grep -c "changeset" AGENTS.md` is at least 1.

## Blocked by

- 013 Scaffold the atlure-ui pnpm workspace with pinned dependencies
