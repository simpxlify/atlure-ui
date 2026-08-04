---
id: "024"
title: Install the published tarballs into scratch Expo and Next apps
repo: atlure-ui
epic: ds-foundations
priority: P0
size: M
serialize: "No"
milestone: M2
blocked_by: "022 Release workflow as the only publisher / plus a next dist-tag; 023 Packaging CI gates: publint / attw and a pack-manifest snapshot"
labels: "epic:ds-foundations; type:test; area:release"
---

# Install the published tarballs into scratch Expo and Next apps

## Context

`publint` and `attw` check metadata; they do not prove a real bundler can resolve the package. The predecessor's broken `exports` map passed every static check and only survived by accident. This ticket proves consumption end to end from the **published** artifact, in both target environments, which is the acceptance gate for milestone M2.

## Scope

- A CI job that creates a throwaway Expo 57.0.10 app and a throwaway Next 16.3.0 app in a temp directory.
- Install `@atlure/ui`, `@atlure/ui-web`, `@atlure/types`, `@atlure/tokens` and `@atlure/tailwind-preset` from the packed tarballs (not from the workspace, not via `link:`).
- In each scratch app, import **every** documented public subpath and reference at least one export, then run the platform's build/typecheck: `npx tsc --noEmit` plus `npx expo export --platform ios` for Expo, and `next build` for Next.
- Assert the Expo scratch app's Metro build succeeds with `@atlure/ui` as untranspiled source — this is where a missing `transformIgnorePatterns` or missing preset `content` glob shows up.
- Assert the Next scratch app's generated CSS contains a `.bg-primary` rule sourced from the DS package path.

## Out of scope

Rendering on a device — that is ticket 061, the NativeWind risk ticket, and it is a separate and higher-risk gate. Component behaviour.

## Files you own

`.github/workflows/consume-smoke.yml`, `scripts/smoke/expo/**`, `scripts/smoke/next/**`.

## Files you must NOT touch

Any package's `package.json` or source. If the smoke test fails, report against the owning package's ticket.

## Acceptance criteria

1. `pnpm run smoke:expo` exits 0 and its log contains a successful `expo export` line.
2. `pnpm run smoke:next` exits 0 and `next build` completes.
3. In the Next scratch app, `grep -c "bg-primary" .next/static/css/*.css` is at least 1.
4. Every subpath listed in each package's `exports` is imported by the scratch apps — verified by a script that reads the `exports` maps and fails if any key is unimported.
5. `gh run list --workflow consume-smoke.yml --limit 1 --json conclusion --jq '.[0].conclusion'` prints `success`.

## Blocked by

- 022 Release workflow as the only publisher / plus a next dist-tag
- 023 Packaging CI gates: publint / attw and a pack-manifest snapshot
