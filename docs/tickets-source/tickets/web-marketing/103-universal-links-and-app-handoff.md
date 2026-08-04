---
id: "103"
title: "Universal links / app-site association and download handoff"
repo: atlure-web
epic: web-marketing
priority: P1
size: M
serialize: "No"
milestone: M5
blocked_by: "095 Scaffold atlure-web with Next 16 / the DS packages and the theme script; 058 Scaffold atlure-paw with expo-router and locked identifiers; 011 Reserve com.atlure.paw on App Store Connect and Google Play"
labels: "epic:web-marketing; type:tooling; area:deeplinks"
---

# Universal links / app-site association and download handoff

## Context

`atlure-paw` declares `applinks:www.atlure.com` in its associated domains and the scheme `atlure`, and the marketing site's sitter profile pages are the primary deep-link entry point. For universal links to work, the site must serve `apple-app-site-association` and `assetlinks.json` at exact paths with exact content types, matching the bundle id `com.atlure.paw` and the Android signing certificate fingerprint. This is fiddly and fails silently, so every part of it is asserted mechanically.

## Scope

- `/.well-known/apple-app-site-association` served with `content-type: application/json`, no file extension, listing the team id and bundle id and the paths that open in the app (`/sitters/*`, `/bookings/*`).
- `/.well-known/assetlinks.json` with the Android package name and the SHA-256 signing certificate fingerprints for every build flavour, including the Play App Signing key — the fingerprint that is usually forgotten.
- A smart handoff page for app-only routes: detect platform, offer the correct store link, and attempt the deep link first for users who have the app.
- Store badges and download calls to action, using placeholder badges until brand assets land (ticket 109) but the real store URLs once ticket 011 has created the records.
- A short-link route for referral codes from ticket 094 that opens the app with the code attached.
- Both files must be static and cacheable, and must survive a redeploy — they are the single point of failure for every deep link.

## Out of scope

Anything inside the app's link handling (ticket 058 declared the domains; deep-link routing is ticket 059). Store listing content (ticket 111). Referral reward mechanics.

## Files you own

`public/.well-known/**` or the route handlers serving them, `app/open/**`, `src/components/app-download/**`, `src/lib/deeplinks.ts`.

## Files you must NOT touch

`atlure-paw/app.config.ts` (ticket 058). `app/sitters/**` (ticket 099) — export the link component for it to import. `app/robots.ts`.

## Acceptance criteria

1. `curl -sI https://www.atlure.com/.well-known/apple-app-site-association` returns 200 with `content-type: application/json` and no redirect.
2. `curl -s https://www.atlure.com/.well-known/apple-app-site-association | jq -e '.applinks.details[0].appIDs[0] | test("com\\.atlure\\.paw$")'` exits 0.
3. `curl -s https://www.atlure.com/.well-known/assetlinks.json | jq -e '.[0].target.package_name == "com.atlure.paw"'` exits 0, and the fingerprint list includes the Play App Signing certificate.
4. A test asserts the associated-domain paths in the association file exactly match the deep-linked route patterns registered in `atlure-paw`'s `routes.ts`, compared against a committed list, so the two cannot drift.
5. On a physical iOS device with the app installed, tapping a `https://www.atlure.com/sitters/<slug>` link from Notes opens the app on that sitter. Attach a screen recording.
6. The same assertion passes on a physical Android device.
7. A test asserts the handoff page offers the App Store link for an iOS user agent and the Play link for Android, and a desktop user agent sees the web page rather than a store redirect.
8. A test asserts a referral short link carries the code through to the deep link.

## Blocked by

- 011 Reserve com.atlure.paw on App Store Connect and Google Play
- 058 Scaffold atlure-paw with expo-router and locked identifiers
- 095 Scaffold atlure-web with Next 16 / the DS packages and the theme script
