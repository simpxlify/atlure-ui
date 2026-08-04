---
id: "023"
title: "Packaging CI gates: publint / attw and a pack-manifest snapshot"
repo: atlure-ui
epic: ds-foundations
priority: P0
size: M
serialize: "No"
milestone: M1
blocked_by: "018 Scaffold @atlure/ui as a source-shipping package; 019 Scaffold @atlure/ui-web sharing cva recipes with the native package"
labels: "epic:ds-foundations; type:ci; area:release"
---

# Packaging CI gates: publint / attw and a pack-manifest snapshot

## Context

The predecessor's published `@simpxlify/pawlii-ui@0.0.40` had an `exports` map pointing at `output/module/components/index.js`, a file that did not exist — it only worked because a legacy `main` stub caught the import. It also shipped `.storybook/preview.d.ts`, `.rnstorybook/` typings and the demo app's screen `.d.ts` files to every consumer. These gates make that entire defect class impossible to regress.

## Scope

- `.github/workflows/ci.yml` running on every PR: `pnpm install --frozen-lockfile`, barrel-drift check, `lint`, `typecheck`, `test`, then the packaging job.
- Packaging job, per publishable package (`tokens`, `tailwind-preset`, `types`, `ui`, `ui-web`): `pnpm pack`, then `publint` on the tarball, then `attw --pack`.
- **Pack-manifest snapshot test**: `tar -tf` the tarball, sort, and diff against a committed `packages/<name>/pack-manifest.txt`. Any unexpected file entering the tarball fails CI with a diff.
- A denylist assertion on every tarball: no path matching `.storybook`, `.rnstorybook`, `.stories.`, `app/`, `output/`, `.env`, `.cursor`, `*.test.*`.
- An `exports`-resolvability assertion: every path in every package's `exports` map exists inside the tarball.

## Out of scope

Publishing (ticket 022). The scratch-app install smoke test (ticket 024). Component tests.

## Files you own

`.github/workflows/ci.yml`, `scripts/check-pack-manifest.mjs`, `packages/*/pack-manifest.txt`.

## Files you must NOT touch

Any package's `package.json` — if `publint` or `attw` reports a problem, the fix belongs to that package's own ticket (018, 019). Report and block rather than editing across ownership boundaries.

## Acceptance criteria

1. `pnpm run check:pack` exits 0 for all five publishable packages.
2. `npx publint --pack pnpm` exits 0 in each publishable package directory.
3. `npx attw --pack .` exits 0 in each publishable package directory.
4. Add `packages/ui/src/Foo.stories.tsx`, run `pnpm run check:pack`, and confirm it exits non-zero naming the denylist match. Delete the file.
5. Add a line to `packages/ui/pack-manifest.txt` that does not exist in the tarball and confirm `pnpm run check:pack` exits non-zero with a diff. Revert.
6. `gh run list --workflow ci.yml --limit 1 --json conclusion --jq '.[0].conclusion'` prints `success`.

## Blocked by

- 018 Scaffold @atlure/ui as a source-shipping package
- 019 Scaffold @atlure/ui-web sharing cva recipes with the native package
