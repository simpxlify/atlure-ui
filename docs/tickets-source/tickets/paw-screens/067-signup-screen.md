---
id: "067"
title: "Screen: Signup"
repo: atlure-paw
epic: paw-screens
priority: P0
size: M
serialize: "No"
milestone: M4
blocked_by: "062 Auth gate: Supabase session / protected routes and role switching; 033 Input / Textarea / Label / FormField and SearchBar"
labels: "epic:paw-screens; type:screen; flow:auth"
---

# Screen: Signup

## Context

Reference: `atlure-spec-reference/src/app/components/SignupScreen.tsx`. Four fields — full name, email, password, confirm password — then straight into the app; the prototype's `handleSignupComplete(name)` sets the display name and marks the user signed in. Because Atlure is EU-wide, signup is also where consent to the terms and privacy policy must be captured, which the prototype does not do at all.

## Scope

- Full name, email, password and confirm-password fields via `FormField`, using `FormScrollView` for keyboard handling.
- Password rules shown as live-updating requirements, not only as an error after submit. Confirm-password mismatch is validated on blur.
- A required checkbox consenting to the terms and privacy policy, linking to `https://www.atlure.com/terms` and `/privacy` in an in-app browser. Submit is blocked until it is checked.
- An optional marketing-consent checkbox, unchecked by default, stored on the profile — separate from the required consent, as EU rules require.
- Submit calls `signUp`, then sets `display_name` on the profile, then routes to role selection so the new user picks a role.
- Error mapping: an already-registered email renders as `conflict` with a link back to login carrying the email through.
- Back to login preserves any typed email.
- Flip this route's `status` to `live` in `src/navigation/routes.ts`.

## Out of scope

Email verification flow gating — decide only whether the account may proceed unverified and document it; do not build a verification wall. Role selection (ticket 068). Profile photo upload (ticket 090).

## Files you own

The signup route file under `app/(auth)/`, `src/screens/signup/**`, one line of `src/navigation/routes.ts`.

## Files you must NOT touch

Any other route file, `src/auth/**`, `src/data/fixtures/**`, the two `_layout.tsx` files.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts submit is disabled until the required consent checkbox is checked, and that `signUp` is called zero times while it is unchecked.
3. A test asserts a password failing a rule shows that specific rule as unmet before submit is pressed.
4. A test asserts a confirm-password mismatch shows an error on blur and blocks submit.
5. A test asserts `signUp` returning `{ ok: false, code: "conflict" }` renders a message offering to sign in and that navigating there carries the entered email.
6. A test asserts a successful signup calls the profile update with the entered display name and then navigates to role selection.
7. A test asserts the marketing-consent value is persisted as `false` when left untouched.
8. `git diff --stat src/navigation/routes.ts` shows exactly one changed line.

## Blocked by

- 033 Input / Textarea / Label / FormField and SearchBar
- 062 Auth gate: Supabase session / protected routes and role switching
