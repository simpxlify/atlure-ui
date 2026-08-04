---
id: "008"
title: Grant gh CLI the project scope
repo: admin
epic: decommission
priority: P0
size: XS
serialize: "No"
milestone: M0
blocked_by: ""
labels: "epic:decommission; type:manual; blocked:waiting-on-external; needs:david"
---

# Grant gh CLI the project scope

## Context

The board lives at `github.com/users/simpxlify/projects/1`. The current `gh` token carries only `gist, read:org, repo, workflow`, so no project field can be read or written — not by a human and not by any agent fanned out later. This is a browser-interactive OAuth flow.

## Scope

**This ticket requires David. An agent cannot complete it.**

Run `gh auth refresh -s project` and complete the browser device-code flow.

## Out of scope

Creating or configuring project fields — that is board setup, done after the scope exists.

## Files you own

None.

## Files you must NOT touch

Nothing.

## Acceptance criteria

1. `gh auth status` lists `project` among the token scopes.
2. `gh project field-list 1 --owner simpxlify` exits 0 and prints at least one field row.

## Blocked by

Nothing. This blocks all board automation.
