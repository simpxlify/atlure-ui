---
id: "111"
title: "Launch: TestFlight and Play internal track"
repo: atlure-paw
epic: quality
priority: P1
size: L
serialize: "Yes"
milestone: M6
blocked_by: "109 Brand assets — logo / app icon / splash and OG imagery; 107 Accessibility audit across the app and the marketing site; 105 End-to-end tests for the M4 thin slice on a real device; 011 Reserve com.atlure.paw on App Store Connect and Google Play"
labels: "epic:quality; type:release; needs:david; serialize"
---

# Launch: TestFlight and Play internal track

## Context

The final gate. Both stores require metadata an agent cannot invent — privacy declarations, data-use answers, content ratings and a support URL — and both require a real signing identity. The app also has three specific review risks: location permission usage (live tracking), identity document collection (sitter verification), and a marketplace model where transactions happen off-platform, which reviewers sometimes read as circumventing in-app purchase. Each needs a prepared, accurate explanation.

## Scope

**Parts of this ticket require David.** Store credentials, signing identities and the review questionnaires cannot be delegated.

- EAS production build profiles for both platforms, with credentials managed by EAS and Play App Signing enabled.
- Store metadata: name, subtitle, description, keywords, category, support URL pointing at `www.atlure.com`, privacy policy URL pointing at the page from ticket 097.
- Apple privacy manifest and the App Store data-use answers, accurate to what ticket 104 actually collects — location at city granularity, contact info, user content, identifiers — and no answer claiming less than the code does.
- Play Data Safety form, matching the same list, plus the sensitive-permission declaration for location.
- Prepared reviewer notes covering: why location is used and that it is foreground-only; that identity documents are stored in a private EU bucket and are not shown to other users; and that Atlure is an introduction service taking no cut, with payment arranged directly between users, so no in-app purchase applies.
- A demo account with seeded data for reviewers, and instructions to reach the M4 journey.
- Upload to TestFlight and the Play internal track, and confirm installation on a physical device from each.
- A launch checklist committed to the repo, covering the version bump, the changelog, source-map upload, a smoke test on the store build, and a rollback plan.

## Out of scope

Public release to either store — internal tracks only. Paid marketing. App store optimisation experiments.

## Files you own

`eas.json` production profiles, `store/**` (metadata, screenshots, reviewer notes), `docs/launch-checklist.md`.

## Files you must NOT touch

`app.config.ts` identifiers — set in ticket 058 and permanent. Any screen source. Do not change the bundle id or slug for any reason.

## Acceptance criteria

1. `eas build --platform all --profile production` produces two finished builds, confirmed by `eas build:list`.
2. `eas submit --platform ios` results in a TestFlight build in `Ready to Test`, installed and launched on a physical iPhone.
3. The Play internal track shows the build as available, installed and launched on a physical Android device.
4. A check asserts the store data-use declarations match the committed data-collection list from ticket 104 — a category collected in code but undeclared fails the check.
5. `store/reviewer-notes.md` covers all three named review risks, and the demo account credentials in it successfully complete the M4 journey.
6. Source maps for both builds are uploaded and a deliberately thrown error in the store build resolves to a readable stack in the error tracker.
7. `grep -ril "pawlii" store/ docs/launch-checklist.md` prints nothing.
8. `docs/launch-checklist.md` exists with a rollback plan, and the version and build numbers in the store match `app.config.ts`.

## Blocked by

- 011 Reserve com.atlure.paw on App Store Connect and Google Play
- 105 End-to-end tests for the M4 thin slice on a real device
- 107 Accessibility audit across the app and the marketing site
- 109 Brand assets — logo / app icon / splash and OG imagery
