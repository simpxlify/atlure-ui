---
id: "066"
title: "Screen: Login"
repo: atlure-paw
epic: paw-screens
priority: P0
size: M
serialize: "No"
milestone: M4
blocked_by: "062 Auth gate: Supabase session / protected routes and role switching; 033 Input / Textarea / Label / FormField and SearchBar; 039 Skeleton / Spinner / EmptyState / ErrorState and ListRow"
labels: "epic:paw-screens; type:screen; flow:auth"
---

# Screen: Login

## Context

Reference: `atlure-spec-reference/src/app/components/LoginScreen.tsx`. It is the app's entry route. Three exits: sign in, go to signup, and **explore without an account** — that third path is load-bearing, it takes an unauthenticated visitor to role selection so they can browse before committing. The prototype hides the form behind a `showLoginForm` toggle so the first view is a hero with the brand and the explore call to action.

## Scope

Replace the placeholder body of the login route with the real screen.

- Hero state: brand mark, headline, `Explore Atlure` primary action, `Sign in` and `Create an account` secondary actions. Note the brand mark is a placeholder until ticket 109 delivers real assets — use the text wordmark, never a "pawlii" image.
- Form state: email and password via `FormField`, revealed by the sign-in action, with a back path to the hero.
- Submit calls `signIn` from `AuthProvider`. Per-field validation before submit; server errors map from the `ErrorCode` union onto field or form-level messages, with `unauthenticated` rendered as invalid credentials rather than a raw code.
- Submitting state disables the button and shows the loading affordance; the keyboard is dismissed and the form uses `FormScrollView`.
- `Forgot password` triggers Supabase's reset email and shows a confirmation toast. No new route — a sheet.
- Explore navigates to role selection without a session.
- Flip this route's `status` to `live` in `src/navigation/routes.ts` — one word, one line.

## Out of scope

Signup (ticket 067), role selection (ticket 068). Social or biometric sign-in. Any change to `AuthProvider` (ticket 062) or the navigation tree (ticket 059).

## Files you own

The login route file under `app/(auth)/`, `src/screens/login/**`, and exactly one line of `src/navigation/routes.ts`.

## Files you must NOT touch

Any other route file. `app/_layout.tsx`, `app/(auth)/_layout.tsx`. `src/auth/**`. `src/data/fixtures/**`. `packages` in any repo.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts the hero renders three actions and that `Explore` navigates to the role-selection route with no session.
3. A test asserts submitting an empty form shows a required-field error on both fields and calls `signIn` zero times.
4. A test asserts a mocked `signIn` returning `{ ok: false, code: "unauthenticated" }` renders a human message containing neither the string `unauthenticated` nor any stack text.
5. A test asserts the submit button is disabled and the spinner visible while the promise is pending, using a deferred mock.
6. A test asserts a successful `signIn` results in navigation to the home tab.
7. `grep -rin "pawlii" src/screens/login app/\(auth\)` prints nothing.
8. `git diff --stat src/navigation/routes.ts` shows exactly one changed line.

## Blocked by

- 033 Input / Textarea / Label / FormField and SearchBar
- 039 Skeleton / Spinner / EmptyState / ErrorState and ListRow
- 062 Auth gate: Supabase session / protected routes and role switching
