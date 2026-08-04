---
id: "020"
title: Generate every barrel index.ts from a glob at build time
repo: atlure-ui
epic: ds-foundations
priority: P0
size: S
serialize: "Yes"
milestone: M1
blocked_by: "018 Scaffold @atlure/ui as a source-shipping package"
labels: "epic:ds-foundations; type:tooling; area:conflict-hotspot; serialize"
---

# Generate every barrel index.ts from a glob at build time

## Context

Barrel files are the worst merge conflict on this project: every one of the 14 `ds-native` component tickets and every `ds-web` ticket would otherwise add a line to the same `src/index.ts`, and agents run in parallel. Both predecessor repos also shipped barrels that exported only 2 of 32 components, making the rest unreachable. Generating the barrel from a filesystem glob removes the conflict entirely rather than managing it.

## Scope

- `scripts/generate-barrels.mjs` at the repo root: for each of `packages/types`, `packages/ui`, `packages/ui-web`, glob `src/**/*.ts(x)` excluding `src/index.ts`, `src/lib/**` internals marked private, `*.test.*` and `*.stories.*`, and write a sorted `export * from` barrel with a header line marking it generated.
- Wire it as a `prepare`/`pretest`/`pretypecheck` step so it always runs before typecheck, test and publish.
- Add `src/index.ts` to `.gitignore` for those three packages **or** commit it and add a CI check that regenerating produces no diff. Pick the committed-plus-check option, because the published tarball ships source and consumers need the file present.
- A test asserting every component file under `src/components/` is reachable from the barrel — the direct guard against the predecessor's 2-of-32 bug.

## Out of scope

Any component. Deep-import subpaths in `exports` — the barrel is the single public entry per package.

## Files you own

`scripts/generate-barrels.mjs`, root `package.json` script hooks, `.github/workflows/ci.yml` barrel-drift step (coordinate with ticket 023 if both are in flight), `packages/*/src/index.ts` as generated output.

## Files you must NOT touch

Any component source. `packages/tokens/**`. **After this ticket lands, no other ticket may hand-edit any `src/index.ts`** — that is the whole point.

## Acceptance criteria

1. `node scripts/generate-barrels.mjs && git diff --exit-code packages/*/src/index.ts` exits 0.
2. Add a scratch file `packages/ui/src/components/ScratchThing.tsx` exporting a component, rerun the script, and confirm `grep -c ScratchThing packages/ui/src/index.ts` prints `1`. Delete the scratch file and rerun.
3. `pnpm test` includes a barrel-reachability test that fails if a file under `src/components/` is absent from the barrel — verify by temporarily adding an exclusion and confirming a non-zero exit.
4. Every generated `src/index.ts` begins with a line containing the word `generated`.

## Blocked by

- 018 Scaffold @atlure/ui as a source-shipping package
