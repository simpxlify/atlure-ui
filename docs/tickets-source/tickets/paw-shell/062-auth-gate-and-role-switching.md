---
id: "062"
title: "Auth gate: Supabase session / protected routes and role switching"
repo: atlure-paw
epic: paw-shell
priority: P0
size: L
serialize: "Yes"
milestone: M3
blocked_by: "059 Land the full navigation tree upfront with every route coming-soon; 054 RLS policies across every table / with an adversarial verification suite"
labels: "epic:paw-shell; type:auth; serialize"
---

# Auth gate: Supabase session / protected routes and role switching

## Context

Atlure uses **one account switchable between pet-parent and pet-sitter** — the prototype's `handleRoleSwitch` changes role without signing out, and the dashboard and profile routes resolve differently per role. The prototype fakes all of this with `useState`, including an `isLoggedIn` boolean and an unauthenticated "explore" path from the login screen that must be preserved: a visitor can browse before signing up.

## Scope

- Supabase client configured with `expo-secure-store` as the session store — never `AsyncStorage`, which is unencrypted.
- `AuthProvider` exposing `session`, `profile`, `activeRole`, `roles`, `status` (`loading` | `signed-out` | `signed-in`), and `signIn`, `signUp`, `signOut`, `switchRole`.
- Automatic token refresh, with refresh paused while the app is backgrounded and resumed on foreground.
- Route protection in `app/_layout.tsx` and `app/(auth)/_layout.tsx`: signed-out users hitting a protected route are redirected to login; signed-in users hitting `(auth)` are redirected to the home tab. No flash of the wrong screen during the `loading` state — render a splash until `status` settles.
- `switchRole` persists `profiles.active_role`, resets the tab to home, and re-resolves the dashboard and profile routes, matching the prototype's behaviour exactly.
- A guard so `switchRole` to a role the profile does not hold either provisions it (sitter onboarding) or fails with `forbidden` — decide and document which; provisioning on first switch matches the prototype's role-selection flow.
- An unauthenticated "explore" mode: the browse and sitter-profile routes render for signed-out users, and any write action prompts sign-in and returns the user to where they were.
- Deep-link handling while signed out: store the intended route, sign in, then continue to it.

## Out of scope

The login, signup, role-selection and onboarding screens themselves (tickets 066, 067, 068, 069) — this ticket provides the provider and the redirects those screens call into. Social sign-in providers. Biometric unlock.

## Files you own

`src/auth/**`, `src/lib/supabase.ts`, `app/_layout.tsx` auth wiring, `app/(auth)/_layout.tsx`.

## Files you must NOT touch

Route files under `app/` other than the two layouts (ticket 059). `src/data/**` (tickets 063, 064, 065). `atlure-api`.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` both exit 0.
2. A test asserts a signed-out client navigating to `/schedule` ends on the login route, and a signed-in client navigating to `/login` ends on the home tab.
3. A test asserts nothing but the splash renders while `status === "loading"` — specifically that neither the login screen nor a tab screen appears in that state.
4. An integration test against local Supabase signs in, force-restarts the provider, and asserts the session is restored from secure store without a second sign-in. `grep -rn "AsyncStorage" src/auth src/lib/supabase.ts` prints nothing.
5. An integration test asserts `switchRole("pet-sitter")` updates `profiles.active_role` in the database, resets the active tab to home, and that the home route resolves to the sitter dashboard.
6. A test asserts a signed-out user can open a sitter profile route, and that pressing a write action routes to login and returns to that same sitter profile after signing in.
7. A test asserts `signOut` clears secure store and that a subsequent protected-route navigation redirects to login.

## Blocked by

- 054 RLS policies across every table / with an adversarial verification suite
- 059 Land the full navigation tree upfront with every route coming-soon
