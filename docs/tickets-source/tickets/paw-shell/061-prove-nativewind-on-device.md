---
id: "061"
title: "UNVERIFIED RISK: prove NativeWind 4.2.6 renders orange on Expo 57 on a real device"
repo: atlure-paw
epic: paw-shell
priority: P0
size: M
serialize: "No"
milestone: M2
blocked_by: "060 Wire NativeWind / the token preset and NAV_THEME into atlure-paw; 028 Button and IconButton"
labels: "epic:paw-shell; type:risk; area:nativewind; blocked:waiting-on-external"
---

# UNVERIFIED RISK: prove NativeWind 4.2.6 renders orange on Expo 57 on a real device

## Context

**This is the highest-risk unknown on the project.** NativeWind 4.2.6 declares **no React Native or Expo peer constraint** — its only peer is `tailwindcss` — so its compatibility with Expo 57.0.10 / RN 0.86.2 is unproven by package metadata. NativeWind 5 exists only as `5.0.0-preview.4` and requires Tailwind above 4.1.11, so it is not an option. A passing typecheck proves nothing: when the Babel transform fails, `className` becomes a dead prop and every component renders unstyled with no error anywhere.

This ticket cannot be closed from a simulator screenshot alone or from Storybook, both of which can pass while a device fails.

## Scope

- Build a development client and install it on a **physical** iOS device and a **physical** Android device.
- Render a probe screen using `Button`, `Card` and `Badge` imported from the **published** `@atlure/ui` (not a workspace link, not a relative path), with `bg-primary`, `text-primary-foreground` and `border-border/20`.
- Capture the actual rendered pixel colour, on device, in both light and dark mode, and compare it against the token's orange within a small tolerance.
- Repeat with the release (minified, production) bundle, not only the dev bundle — Babel plugin ordering issues frequently appear only in release.
- Record the outcome and the exact versions in `docs/nativewind-compat.md`.
- **Fallback path if it fails**: pin Expo to 56.0.18 and RN to the SDK 56 pairing, re-run the same probe, and document the downgrade. Do not attempt NativeWind 5. If the downgrade is required, open follow-up tickets to re-pin `atlure-ui`'s dev dependencies to match.

## Out of scope

Any product screen. Fixing NativeWind itself. Upgrading to NativeWind 5 under any circumstances.

## Files you own

`app/_dev/nativewind-probe.tsx` (a dev-only route excluded from production builds), `docs/nativewind-compat.md`, `e2e/nativewind-probe.test.ts`.

## Files you must NOT touch

`babel.config.js`, `metro.config.js`, `tailwind.config.js` (ticket 060) — if the probe fails because of configuration, report it there. Any `app/` route from ticket 059.

## Acceptance criteria

1. On a physical iOS device running a release build, a screenshot of the probe screen sampled at the centre of the `bg-primary` button returns an RGB value within 5 per unit channel of the token orange `#ea580c`. Attach the screenshot to the ticket.
2. The same assertion passes on a physical Android device.
3. The same assertions pass in dark mode, where `primary` must still be orange — the prototype's dark palette lost the brand and the token tests now forbid that.
4. The probe imports from the published package: `grep -n "@atlure/ui" app/_dev/nativewind-probe.tsx` shows a bare specifier, and `node -e "require.resolve('@atlure/ui')"` resolves inside `node_modules`, not a linked path.
5. `docs/nativewind-compat.md` records the exact `expo`, `react-native`, `nativewind` and `tailwindcss` versions tested and the verdict.
6. If the verdict is failure: the same six criteria pass on Expo 56.0.18, and follow-up tickets exist for re-pinning the other repos.

## Blocked by

- 028 Button and IconButton
- 060 Wire NativeWind / the token preset and NAV_THEME into atlure-paw
