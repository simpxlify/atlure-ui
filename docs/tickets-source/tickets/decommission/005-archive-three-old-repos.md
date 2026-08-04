---
id: "005"
title: Archive pawlii / pawlii-ui and PawliiApp
repo: admin
epic: decommission
priority: P2
size: XS
serialize: "No"
milestone: M1
blocked_by: "001 Salvage uncommitted Desktop work to salvage/pre-atlure; 004 Remove tracked .cursor/mcp.json and gitleaks-scan predecessor history; 006 npm deprecate @simpxlify/pawlii-ui pointing at @atlure/ui"
labels: "epic:decommission; type:hygiene"
---

# Archive pawlii / pawlii-ui and PawliiApp

## Context

Three years of Pawlii half-starts live in `simpxlify/pawlii` (an untouched Expo scaffold plus the salvage branch), `simpxlify/pawlii-ui` (the published three-component design system with a broken `exports` map) and `simpxlify/PawliiApp` (the finalized Figma Make prototype, which is the product spec). Nothing is being ported. Archiving makes them read-only so no agent can commit into the wrong repo by mistake.

## Scope

- Add a pointer line to each repo README naming its atlure replacement.
- `gh repo archive simpxlify/pawlii --yes`
- `gh repo archive simpxlify/pawlii-ui --yes`
- `gh repo archive simpxlify/PawliiApp --yes`

## Out of scope

Deleting any repo. Deleting `salvage/pre-atlure`. The prototype must stay readable forever — it is the product spec for all 29 screen tickets.

## Files you own

`README.md` in each of the three old repos.

## Files you must NOT touch

Anything in the four atlure repos.

## Acceptance criteria

1. For each of the three, `gh repo view simpxlify/<name> --json isArchived --jq .isArchived` prints `true`.
2. `git -C C:\Users\birub\Documents\GitHub\atlure-spec-reference log -1 --oneline` succeeds, proving the prototype spec is available locally and independent of the archived remote.

## Blocked by

- 001 Salvage uncommitted Desktop work to salvage/pre-atlure
- 004 Remove tracked .cursor/mcp.json and gitleaks-scan predecessor history
- 006 npm deprecate @simpxlify/pawlii-ui pointing at @atlure/ui
