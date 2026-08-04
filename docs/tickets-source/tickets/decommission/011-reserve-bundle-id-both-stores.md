---
id: "011"
title: Reserve com.atlure.paw on App Store Connect and Google Play
repo: admin
epic: decommission
priority: P1
size: S
serialize: "No"
milestone: M0
blocked_by: ""
labels: "epic:decommission; type:manual; blocked:waiting-on-external; needs:david; area:stores"
---

# Reserve com.atlure.paw on App Store Connect and Google Play

## Context

The mobile app's iOS bundle id and Android application id are both `com.atlure.paw`. **Bundle ids and Android package names are permanent once an app is submitted** — they cannot be renamed afterwards, only abandoned. A future companion app becomes `com.atlure.scoop`, so nothing in the identifier may encode "paw" beyond this one app. Reserving early prevents a squatter and prevents a late rename.

## Scope

**This ticket requires David. An agent cannot complete it.** Both flows are browser-interactive and require paid developer accounts.

- App Store Connect: register App ID `com.atlure.paw`, create the app record named `Atlure`.
- Google Play Console: create the app with package name `com.atlure.paw`.

## Out of scope

Store listing copy, screenshots, icons, privacy questionnaires, TestFlight or internal-track uploads. Icons in particular are blocked on brand assets (ticket 109).

## Files you own

None.

## Files you must NOT touch

`atlure-paw/app.config.ts` — owned by ticket 058, which is where the id is set in code.

## Acceptance criteria

1. App Store Connect shows an app record with bundle id exactly `com.atlure.paw`.
2. Google Play Console shows an app with package name exactly `com.atlure.paw`.
3. Run `npx expo config --type public --json` in `atlure-paw` and confirm `.ios.bundleIdentifier` and `.android.package` are both exactly `com.atlure.paw`, matching the two store records.

## Blocked by

Nothing.
