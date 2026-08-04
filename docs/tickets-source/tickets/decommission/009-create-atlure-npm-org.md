---
id: "009"
title: Create the @atlure npm org and publish token
repo: admin
epic: decommission
priority: P0
size: XS
serialize: "No"
milestone: M0
blocked_by: ""
labels: "epic:decommission; type:manual; blocked:waiting-on-external; needs:david; area:npm"
---

# Create the @atlure npm org and publish token

## Context

With a polyrepo, publishing to npm is the **only** path by which `atlure-paw`, `atlure-web` and `atlure-api` consume the design system — there is no workspace link across repos. `npm org ls atlure` confirms the scope does not exist yet. `npm whoami` returns `simpxlify`. Creating an org and minting a token are both browser-interactive.

## Scope

**This ticket requires David. An agent cannot complete it.**

- Create the org at `npmjs.com/org/create` with name `atlure` (free tier, public packages).
- Mint a **granular access token** with read+write limited to packages under the `@atlure` scope.
- Store it as the GitHub Actions secret `NPM_TOKEN` on `simpxlify/atlure-ui`.

## Out of scope

Publishing any package. Configuring changesets or the release workflow (tickets 021, 022).

## Files you own

None.

## Files you must NOT touch

Do not put the token in any file in any repo. Actions secret only.

## Acceptance criteria

1. `npm org ls atlure` exits 0 and lists `simpxlify` as an owner.
2. `gh secret list --repo simpxlify/atlure-ui` includes `NPM_TOKEN`.
3. `npm access list packages @atlure` exits 0 (an empty list is the expected result before the first publish).

## Blocked by

Nothing. This blocks the entire M1 release-pipeline proof.
