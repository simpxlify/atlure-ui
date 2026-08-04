---
id: "003"
title: Gitignore .env across all four new repos
repo: admin
epic: decommission
priority: P1
size: XS
serialize: "No"
milestone: M0
blocked_by: "002 Create and clone the four atlure repos"
labels: "epic:decommission; type:hygiene; area:security"
---

# Gitignore .env across all four new repos

## Context

The predecessor repo `simpxlify/pawlii-ui` committed a `.env`. Every revision in its history was audited: it only ever contained `EXPO_PUBLIC_STORYBOOK_ENABLED=false`. **No credential leaked and there is nothing to rotate.** This ticket exists only so the same habit cannot cause a real leak in the four new repos.

## Scope

In each of `atlure-ui`, `atlure-paw`, `atlure-web`, `atlure-api`:

- Ensure `.gitignore` contains `.env`, `.env.*`, and the negation `!.env.example`.
- Add a committed `.env.example` naming every variable the repo reads, with empty values.
- Confirm no `.env` is currently tracked.

## Out of scope

Rewriting history in the old repos. Rotating any secret. Introducing a secrets manager, doppler, or CI secret wiring.

## Files you own

- `.gitignore` in all four repos
- `.env.example` in all four repos

## Files you must NOT touch

Any source file, any `package.json`, any workflow file. Two files per repo, nothing else.

## Acceptance criteria

1. In each of the four repos, `git check-ignore -v .env` exits 0 and names the rule.
2. In each of the four repos, `git ls-files .env` prints nothing.
3. In each of the four repos, `git ls-files .env.example` prints `.env.example`.

## Blocked by

- 002 Create and clone the four atlure repos
