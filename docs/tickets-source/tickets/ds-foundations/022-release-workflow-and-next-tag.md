---
id: "022"
title: Release workflow as the only publisher / plus a next dist-tag
repo: atlure-ui
epic: ds-foundations
priority: P0
size: M
serialize: "Yes"
milestone: M1
blocked_by: "009 Create the @atlure npm org and publish token; 021 Configure changesets with a fixed version group across @atlure/*; 023 Packaging CI gates: publint / attw and a pack-manifest snapshot"
labels: "epic:ds-foundations; type:ci; area:release; serialize"
---

# Release workflow as the only publisher / plus a next dist-tag

## Context

With four separate repos, npm is the only path by which the app and website consume the design system, so publishing is mandatory and must be reliable. GitHub Actions must be the **only** publisher — no `npm publish` from a laptop ever, which is how the predecessor accumulated 28 unreviewed versions. A `next` dist-tag published from feature branches lets `atlure-paw` test a design-system change before it reaches `latest`. The milestone gate for M1 is proving this pipeline by publishing `@atlure/tokens@0.1.0-alpha.0` before any component exists.

## Scope

- `.github/workflows/release.yml`: on push to `main`, run the packaging gates, then `changesets/action` with `publish: pnpm release`. `NODE_AUTH_TOKEN` from the `NPM_TOKEN` secret. Provenance enabled.
- `.github/workflows/release-next.yml`: on push to any `feat/**` branch, `changeset version --snapshot next` then `changeset publish --tag next`. Never touches `latest`.
- Root `release` script running `pnpm -r build` where applicable, then `changeset publish`.
- Prove the pipeline: cut a changeset and publish `@atlure/tokens@0.1.0-alpha.0` through the workflow.
- Add a repo ruleset blocking direct pushes to `main` so the workflow is genuinely the only path.

## Out of scope

Defining the packaging gates themselves (ticket 023) — this ticket only calls them. Publishing components.

## Files you own

`.github/workflows/release.yml`, `.github/workflows/release-next.yml`, the `release` script in the root `package.json`.

## Files you must NOT touch

`.changeset/config.json` (ticket 021). `.github/workflows/ci.yml` (ticket 023). Any package source.

## Acceptance criteria

1. `npm view @atlure/tokens@0.1.0-alpha.0 dist.tarball` resolves — the pipeline has published at least once.
2. `npm view @atlure/tokens --json` shows the version's `_npmUser` corresponding to the CI token, not a local user.
3. `gh run list --workflow release.yml --limit 1 --json conclusion --jq '.[0].conclusion'` prints `success`.
4. Push a changeset on a `feat/**` branch and confirm `npm view @atlure/tokens dist-tags` gains a `next` entry while `latest` is unchanged.
5. `git push origin main` from a laptop is rejected by the ruleset.

## Blocked by

- 009 Create the @atlure npm org and publish token
- 021 Configure changesets with a fixed version group across @atlure/*
- 023 Packaging CI gates: publint / attw and a pack-manifest snapshot
