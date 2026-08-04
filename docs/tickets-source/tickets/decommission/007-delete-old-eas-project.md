---
id: "007"
title: Delete the old pawlii EAS project
repo: admin
epic: decommission
priority: P3
size: XS
serialize: "No"
milestone: M6
blocked_by: "058 Scaffold atlure-paw with expo-router and locked identifiers"
labels: "epic:decommission; type:hygiene; area:eas"
---

# Delete the old pawlii EAS project

## Context

EAS project `287453d9-1ce7-4655-a01b-bda810a6598f` is bound to Expo slug `pawlii` and bundle id `com.simpxlify.pawlii`. It has never shipped a build to any store, so there is no install base to preserve. Atlure uses a brand-new EAS project bound to slug `atlure-paw` and `com.atlure.paw`. Deletion is irreversible, so the new project must be proven working first.

## Scope

- Verify the new `atlure-paw` EAS project exists and has produced a finished build.
- Then delete the `pawlii` project in expo.dev project settings.

## Out of scope

Anything about the new project's credentials, build profiles or store submissions.

## Files you own

None.

## Files you must NOT touch

`atlure-paw/app.config.ts` and `atlure-paw/eas.json` — owned by ticket 058.

## Acceptance criteria

1. `eas project:info` inside `atlure-paw` prints slug `atlure-paw` and a project id that is not `287453d9-1ce7-4655-a01b-bda810a6598f`.
2. `eas build:list --limit 1` inside `atlure-paw` shows a build with status `finished`.
3. Only then: `pawlii` no longer appears in `eas project:list` for the account.

## Blocked by

- 058 Scaffold atlure-paw with expo-router and locked identifiers
