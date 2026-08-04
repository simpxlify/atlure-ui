---
id: "001"
title: Salvage uncommitted Desktop work to salvage/pre-atlure
repo: admin
epic: decommission
priority: P0
size: S
serialize: "No"
milestone: M0
blocked_by: ""
labels: "epic:decommission; status:done; type:salvage"
---

# Salvage uncommitted Desktop work to salvage/pre-atlure

**STATUS: DONE.** Recorded for board completeness. Do not redo it.

## Context

`C:\Users\birub\Desktop\pawlii` held the only copy of several hand-written files (`contexts/AuthContext.tsx`, `hooks/useAuth.ts`, `components/auth/*`, `components/splash/SplashScreen.tsx`, `types/petRelated.ts`) with no backup anywhere. This was the highest-probability catastrophic loss on the project. The work is now pushed to branch `salvage/pre-atlure` on `simpxlify/pawlii`.

## Scope

Nothing. Already complete.

## Out of scope

Porting any of this code into the new repos. Atlure screens are rebuilt fresh from the prototype spec; zero files are ported.

## Files you own

None.

## Files you must NOT touch

Do not force-push, rebase or delete `salvage/pre-atlure`. It is the archive of record.

## Acceptance criteria

1. `gh api repos/simpxlify/pawlii/branches/salvage/pre-atlure --jq .name` prints `salvage/pre-atlure`.
2. `git ls-tree -r --name-only origin/salvage/pre-atlure` lists `contexts/AuthContext.tsx`, `hooks/useAuth.ts` and `types/petRelated.ts`.

## Blocked by

Nothing.
