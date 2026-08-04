---
id: "107"
title: "Accessibility audit across the app and the marketing site"
repo: all
epic: quality
priority: P1
size: L
serialize: "No"
milestone: M6
blocked_by: "091 Screens: pet-parent and pet-sitter profile tabs with role switching; 096 Core marketing pages: home / how it works / for sitters"
labels: "epic:quality; type:a11y"
---

# Accessibility audit across the app and the marketing site

## Context

Every component ticket carried accessibility criteria, but per-component compliance does not add up to a usable screen — focus order, announcement order, dynamic-type layout and contrast all only appear once real screens exist. This is also a store-review and EU-compliance concern, not only a quality one. The audit is a real pass over real screens, not a linter run.

## Scope

- Automated sweep: `axe` on every marketing page, and the React Native accessibility checks plus `eslint-plugin-jsx-a11y` equivalents on every app screen. Zero violations required on both.
- Manual screen-reader pass over the M4 journey with VoiceOver and TalkBack: every interactive element is reachable, labelled, and announces its state; focus does not escape open sheets and dialogs; closing an overlay returns focus to its trigger.
- Contrast: verify every token pair used in practice against WCAG AA in both themes, including the orange primary against its foreground, which is the pair most likely to fail. Report failures against ticket 015 rather than patching colours locally.
- Dynamic type: every screen at the largest OS text size with no clipping, no overlap and no unreachable action. This is where fixed heights break, so it needs a real pass.
- Touch targets: minimum 44x44 on every interactive element in situ, not only in isolation.
- Reduced motion honoured across animations, sheets and the onboarding carousel.
- Landmarks and heading order on the web; a skip link that works.
- A written report listing every finding with severity, and follow-up tickets for anything not fixed within this ticket.

## Out of scope

Rewriting a screen's layout — file a ticket against that screen instead. A formal third-party audit or certification. Changing tokens.

## Files you own

`docs/accessibility-audit.md` in both `atlure-paw` and `atlure-web`, `.github/workflows/a11y.yml` in both, plus small labelling fixes confined to one line each.

## Files you must NOT touch

`packages/tokens/**`. Any screen's structural layout — report instead. Other agents' in-flight screen tickets.

## Acceptance criteria

1. `pnpm test:a11y` exits 0 in `atlure-web` with zero `axe` violations across every route in the registry.
2. `pnpm lint` in `atlure-paw` exits 0 with the accessibility rule set enabled and no disable comments added.
3. A contrast test asserts every token foreground/background pair in use meets AA in both themes, and names any failing pair rather than skipping it.
4. A dynamic-type test renders each of the 25 screens at the largest text scale and asserts no text node is clipped and every interactive element remains within bounds.
5. A test asserts every interactive element's hit target is at least 44x44 in situ on every screen.
6. A focus test asserts opening and closing every sheet and dialog returns focus to the triggering element.
7. `docs/accessibility-audit.md` lists every finding with a severity and either a fix commit or a follow-up ticket id — no finding is left unassigned.
8. The manual VoiceOver and TalkBack pass over the M4 journey is recorded, with a screen recording attached.

## Blocked by

- 091 Screens: pet-parent and pet-sitter profile tabs with role switching
- 096 Core marketing pages: home / how it works / for sitters
