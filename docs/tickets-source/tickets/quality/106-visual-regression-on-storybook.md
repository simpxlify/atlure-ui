---
id: "106"
title: "Visual regression on the Storybook workbench"
repo: atlure-ui
epic: quality
priority: P2
size: M
serialize: "No"
milestone: M5
blocked_by: "025 Storybook workbench in apps/ / never published; 039 Skeleton / Spinner / EmptyState / ErrorState and ListRow"
labels: "epic:quality; type:test"
---

# Visual regression on the Storybook workbench

## Context

Every component in `@atlure/ui` and `@atlure/ui-web` shares generated tokens and cva recipes, so a single token or recipe change can alter every component at once. Unit tests assert class strings, which is exactly the wrong granularity for catching that. The Storybook build is already produced in CI, so screenshot diffing it is cheap insurance — particularly for the light and dark pairs, where the prototype's lost-brand bug lived.

## Scope

- Playwright-driven screenshot capture of every story in the static Storybook build, in both light and dark themes.
- Committed baselines per story per theme, with a diff threshold tight enough to catch a colour change and loose enough to tolerate font rasterisation differences. Run in a fixed container image so rendering is deterministic.
- A CI job that fails on any diff and uploads the actual, expected and diff images as artifacts.
- An explicit baseline-update command, so accepting a change is a reviewed commit rather than an automatic overwrite.
- Cover the interaction states that a static screenshot can reach: default, hover and focus on web components, disabled, invalid, loading, and the four feedback states.
- Exclude anything genuinely non-deterministic (relative timestamps, shimmer animation frames) by freezing time and disabling animation in the capture configuration rather than by removing the story.

## Out of scope

Native on-device visual testing (that is tickets 061 and 105). Cross-browser matrixing — one engine is enough at this stage. Visual testing of the marketing site (ticket 110 covers its budgets).

## Files you own

`apps/storybook-web/visual/**`, `.github/workflows/visual.yml`, the committed baseline images.

## Files you must NOT touch

Any component source, and any `*.stories.tsx` file — those belong to their component tickets. If a story is untestable as written, report on that component's ticket.

## Acceptance criteria

1. `pnpm visual:test` exits 0 on the clean tree with every baseline matching.
2. Change one token value in a scratch commit, run `pnpm visual:test`, and confirm it exits non-zero and reports diffs on more than one component. Revert.
3. Two consecutive runs on the same commit produce zero diffs, proving determinism.
4. A test asserts the captured story count equals the story count in the Storybook index — no story is silently skipped.
5. Every story has a baseline in both light and dark: a check fails if any story has only one.
6. `pnpm visual:update` regenerates baselines and produces a diff in git rather than modifying files in CI.
7. `gh run list --workflow visual.yml --limit 1 --json conclusion --jq '.[0].conclusion'` prints `success`, and a failing run has the three images attached as artifacts.

## Blocked by

- 025 Storybook workbench in apps/ / never published
- 039 Skeleton / Spinner / EmptyState / ErrorState and ListRow
