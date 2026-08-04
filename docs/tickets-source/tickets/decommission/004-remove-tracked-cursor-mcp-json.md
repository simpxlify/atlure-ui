---
id: "004"
title: Remove tracked .cursor/mcp.json and gitleaks-scan predecessor history
repo: admin
epic: decommission
priority: P2
size: S
serialize: "No"
milestone: M0
blocked_by: "003 Gitignore .env across all four new repos"
labels: "epic:decommission; type:hygiene; area:security"
---

# Remove tracked .cursor/mcp.json and gitleaks-scan predecessor history

## Context

`pawlii-ui/.cursor/mcp.json` is tracked in git and holds a nonce for a **localhost** MCP server (`127.0.0.1:63266`). Severity is low — it is not a remote credential — but editor config carrying a token should not be in a repo, and `@simpxlify/pawlii-ui` is public on npm while the repo is private.

## Scope

- `git rm --cached .cursor/mcp.json` in `pawlii-ui`, add `.cursor/` to its `.gitignore`, commit, push.
- Add `.cursor/` to `.gitignore` in all four atlure repos so it cannot recur.
- Run `gitleaks detect` over the full history of `simpxlify/pawlii` and `simpxlify/pawlii-ui` and post the finding count as a ticket comment.

## Out of scope

History rewriting (`git filter-repo`, BFG). The repos are being archived and the only finding is a localhost nonce — rewriting is not justified. Rotating anything.

## Files you own

- `pawlii-ui/.gitignore` and the deletion of `pawlii-ui/.cursor/mcp.json`
- `.gitignore` in the four atlure repos (same file as ticket 003 — land 003 first)

## Files you must NOT touch

Any file in `atlure-*` other than `.gitignore`. Do not touch `simpxlify/PawliiApp`.

## Acceptance criteria

1. `git ls-files .cursor/mcp.json` in `pawlii-ui` prints nothing.
2. `git check-ignore -v .cursor/mcp.json` exits 0 in `pawlii-ui` and in all four atlure repos.
3. `gitleaks detect --source . --no-banner --report-path leaks.json` has been run against both predecessor repos and the finding count is posted as a comment. A non-zero count does not block — the expected finding is the localhost nonce.

## Blocked by

- 003 Gitignore .env across all four new repos
