---
id: "002"
title: Create and clone the four atlure repos
repo: admin
epic: decommission
priority: P0
size: S
serialize: "No"
milestone: M0
blocked_by: ""
labels: "epic:decommission; status:done; type:scaffold"
---

# Create and clone the four atlure repos

**STATUS: DONE.** Recorded for board completeness. Do not redo it.

## Context

Atlure is a polyrepo, not a monorepo: `atlure-ui` (design system, publishes `@atlure/*`), `atlure-paw` (Expo mobile app — the product, all 25 screens), `atlure-web` (Next.js marketing site only), `atlure-api` (Supabase migrations plus a thin Hono service). All four are private under `simpxlify` and are already created and cloned under `C:\Users\birub\Documents\GitHub\`.

## Scope

Nothing. Already complete.

## Out of scope

Any repo content — that belongs to the per-repo scaffold tickets 013, 045, 057 and 094.

## Files you own

None.

## Files you must NOT touch

Do not rename, transfer or make public any of the four repos.

## Acceptance criteria

1. `gh repo list simpxlify --json name --jq '.[].name'` includes `atlure-ui`, `atlure-paw`, `atlure-web` and `atlure-api`.
2. All four names exist as directories under `C:\Users\birub\Documents\GitHub\`.

## Blocked by

Nothing.
