---
id: "069"
title: "Screen: Onboarding carousel and dashboard coach marks"
repo: atlure-paw
epic: paw-screens
priority: P2
size: M
serialize: "No"
milestone: M5
blocked_by: "068 Screen: Role selection; 036 Slider / RangeSlider and Progress"
labels: "epic:paw-screens; type:screen; flow:auth"
---

# Screen: Onboarding carousel and dashboard coach marks

## Context

References: `atlure-spec-reference/src/app/components/OnboardingScreen.tsx` (a stepped carousel whose content differs per role) and `OnboardingCoachMarks.tsx` (an overlay shown once on the dashboard after first login, driven by a `stepIndex`). Two components, one concern, so they share a ticket. The coach marks overlay the dashboard rather than being a route, which is why this ticket touches the dashboard route's overlay slot and nothing else in it.

## Scope

- Onboarding carousel: role-specific step content, swipeable, with a progress indicator, `Previous`/`Next`, and a `Skip` that is always reachable.
- Completing or skipping persists the onboarding-seen flag on the profile and routes to the home tab.
- Coach marks: an overlay highlighting the tab bar, the find-a-sitter action and the notifications action, advanced by tap, dismissible at any point, shown at most once per profile and persisted server-side.
- The overlay must not trap the user: a visible dismiss control, hardware back closes it, and it never blocks the underlying screen after dismissal.
- Accessibility: each step announces itself, the carousel is operable without swiping (the Next control suffices), and the overlay does not hide the underlying content from screen readers permanently.
- Reduced motion: no parallax or auto-advance when the OS setting is on.
- Flip the onboarding route's `status` to `live`.

## Out of scope

The dashboard itself (ticket 074) — you add the overlay mount only. Push-notification permission prompting (ticket 108). Any change to role selection.

## Files you own

The onboarding route file, `src/screens/onboarding/**`, `src/components/coach-marks/**`, one line of `src/navigation/routes.ts`, and the overlay mount line in the home route.

## Files you must NOT touch

The body of the dashboard screens (`src/screens/dashboard-parent/**`, `src/screens/dashboard-sitter/**`). `src/auth/**`. Other route files.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts the step content differs between `pet-parent` and `pet-sitter` for at least one step.
3. A test asserts `Skip` on step one persists the seen flag and navigates to the home tab, and that re-entering the app does not show onboarding again.
4. A test asserts the carousel advances via the `Next` control alone, with no gesture, through every step to completion.
5. A test asserts the coach-marks overlay renders at most once per profile: after dismissal, a remount with the same profile renders nothing.
6. A test asserts the hardware back event dismisses the overlay and that after dismissal a press passes through to the underlying dashboard action.
7. A test with reduced motion mocked true asserts no auto-advance timer is registered.

## Blocked by

- 036 Slider / RangeSlider and Progress
- 068 Screen: Role selection
