---
id: "016"
title: Token checksum test and a lint rule banning raw hex
repo: atlure-ui
epic: ds-foundations
priority: P0
size: S
serialize: "No"
milestone: M1
blocked_by: "013 Scaffold the atlure-ui pnpm workspace with pinned dependencies"
labels: "epic:ds-foundations; type:test; area:tokens"
---

# Token checksum test and a lint rule banning raw hex

## Context

Generated token artifacts are only trustworthy if hand-editing one fails the build, and `tokens.ts` is only the single source of truth if no other file can declare a colour. Two enforcement mechanisms are needed. `packages/tokens/src/tokens.ts` is written by the lead and is frozen once landed — the lint rule removes any reason to reopen it.

## Scope

- `packages/tokens/test/checksum.test.ts`: recompute the checksum of each generated artifact from the committed source and compare it against the checksum the generator records. Any hand edit to a generated file fails.
- An ESLint rule (`no-restricted-syntax` on string literals, or a small local plugin) banning hex colour literals matching `#[0-9a-fA-F]{3,8}` and `rgb(`/`rgba(`/`hsl(` function strings **everywhere in the repo except** `packages/tokens/src/tokens.ts` and test fixtures.
- Wire the rule into the root ESLint config so it applies to `packages/ui`, `packages/ui-web` and `apps/storybook-web`.

## Out of scope

The parity test (ticket 015). Editing `tokens.ts` or the generator. Extending this lint rule into `atlure-paw` or `atlure-web` — those repos get their own copy in their scaffold tickets.

## Files you own

`packages/tokens/test/checksum.test.ts`, `eslint.config.mjs` at the repo root, and `eslint-rules/` if a local plugin is needed.

## Files you must NOT touch

`packages/tokens/src/**` and `packages/tokens/scripts/**`.

## Acceptance criteria

1. `pnpm --filter @atlure/tokens test` exits 0.
2. Append a single space to a generated artifact, run `pnpm --filter @atlure/tokens test`, and confirm it exits non-zero naming that file. Revert.
3. Add `const c = "#ea580c";` to a scratch file under `packages/ui/src/`, run `pnpm lint`, and confirm it exits non-zero reporting the hex literal. Delete the scratch file.
4. `pnpm lint` exits 0 on the clean tree, proving `tokens.ts` is correctly exempted.

## Blocked by

- 013 Scaffold the atlure-ui pnpm workspace with pinned dependencies
