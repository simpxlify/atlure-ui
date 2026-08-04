---
id: "109"
title: "Brand assets — logo / app icon / splash and OG imagery"
repo: all
epic: quality
priority: P1
size: M
serialize: "No"
milestone: M6
blocked_by: ""
labels: "epic:quality; type:manual; needs:david; blocked:waiting-on-decision; area:brand"
---

# Brand assets — logo / app icon / splash and OG imagery

## Context

**Atlure has no brand assets. Every logo, icon and splash screen that exists says "pawlii".** The name changed because someone bought the pawlii domain first, and nothing visual was ever remade. This does not block development — the app and site use a text wordmark and the token colours — but it blocks store submission, OG images and anything that looks finished. **An agent cannot do this.** It needs a designer or a decision from David, and it takes calendar time, so it must start early even though it lands in M6.

## Scope

**This ticket requires David. Do not assign it to an agent.**

Assets needed, all derived from the existing brand colours (primary orange `#ea580c`, cream `#fff7ed`, navy `#1e3a8a`):

- Wordmark and a standalone mark, in light and dark variants, as SVG.
- iOS app icon (1024x1024, no transparency, no rounded corners baked in) and the adaptive Android icon as separate foreground and background layers.
- Splash screen artwork sized for both platforms, plus the background colour token to pair with it.
- Notification icon for Android (monochrome, transparent).
- Favicon set and a web app manifest icon set.
- Open Graph and Twitter card templates, 1200x630, that the generated OG image from ticket 101 composes against.
- Store screenshots for both stores at the required sizes — these depend on finished screens, so they come last.

Deliverables go into `atlure-paw/assets/`, `atlure-web/public/`, and a shared `brand/` folder in `atlure-ui` for the SVG sources.

## Out of scope

Renaming anything in code — identifiers are already `atlure` and `com.atlure.paw`. A full brand guideline document. Rebuilding the design tokens; the colours are settled.

## Files you own

`atlure-paw/assets/**`, `atlure-web/public/icons/**`, `atlure-ui/brand/**`, and the icon and splash entries in `atlure-paw/app.config.ts`.

## Files you must NOT touch

`packages/tokens/**` — the colours are already correct. Any component or screen source.

## Acceptance criteria

1. `grep -ril "pawlii" atlure-paw/assets atlure-web/public atlure-ui/brand` prints nothing, and no committed image file contains the pawlii wordmark on visual inspection.
2. `npx expo config --type public --json` reports `icon`, `splash` and `android.adaptiveIcon` pointing at files that exist, and `npx expo-doctor` reports no asset warnings.
3. The iOS icon is exactly 1024x1024 with no alpha channel, asserted by an image-metadata check in CI.
4. The Android adaptive icon has separate foreground and background files, both present, with the foreground respecting the safe zone.
5. `curl -s https://www.atlure.com/opengraph-image` returns a 1200x630 PNG composed against the new template.
6. A Lighthouse PWA-icon check on `www.atlure.com` reports no missing icon sizes.
7. Store screenshot sets exist for both stores at every required size, attached to ticket 111.

## Blocked by

Nothing. This blocks ticket 111 and part of ticket 101.
