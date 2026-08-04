---
id: "068"
title: "Screen: Role selection"
repo: atlure-paw
epic: paw-screens
priority: P0
size: S
serialize: "No"
milestone: M4
blocked_by: "062 Auth gate: Supabase session / protected routes and role switching; 029 Card family and Separator"
labels: "epic:paw-screens; type:screen; flow:auth"
---

# Screen: Role selection

## Context

Reference: `atlure-spec-reference/src/app/components/RoleSelectionScreen.tsx`. Two large choice cards — pet parent or pet sitter — with a brief transition state (`isAnimating`, "Getting things ready...") before landing. It is reached both from signup and from the unauthenticated explore path, so it must work with and without a session. The heading in the prototype says "Welcome to Pawlii" and must be rewritten.

## Scope

- Two selectable cards describing each role in plain language, using `Card variant="interactive"`.
- Selecting a role calls `switchRole` when a session exists, provisioning the role if the profile does not hold it yet.
- With no session (explore path), the selection is held locally and the user lands on the corresponding dashboard in read-only explore mode; any write action routes to signup and resumes with the chosen role.
- A transition state while the role is being provisioned, replacing the prototype's fixed animation delay with the real pending state — no artificial timers.
- After the role is set, route to onboarding if the user has not seen it, otherwise to the home tab. Persist the seen flag on the profile, not in memory, so reinstalling does not silently reset it for a signed-in user.
- Back returns to login, matching the prototype's `handleBack`.
- Flip this route's `status` to `live`.

## Out of scope

Onboarding content (ticket 069). Sitter verification or service setup — a newly provisioned sitter lands on an empty sitter dashboard. Editing `AuthProvider`.

## Files you own

The role-selection route file, `src/screens/role-selection/**`, one line of `src/navigation/routes.ts`.

## Files you must NOT touch

Any other route file, `src/auth/**`, `src/data/fixtures/**`, layouts.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts two role cards render and that only one can be selected at a time.
3. A test with a session asserts choosing `pet-sitter` calls `switchRole("pet-sitter")` exactly once and navigates to onboarding on first run.
4. A test with a session whose profile already has the onboarding flag set asserts it navigates to the home tab instead.
5. A test with no session asserts no `switchRole` call happens and the user lands on the parent dashboard in explore mode.
6. A test asserts the transition state is driven by the pending promise, not a timer: with a deferred mock it stays visible until resolution and no `setTimeout` appears in the screen source (`grep -n "setTimeout" src/screens/role-selection` prints nothing).
7. `grep -rin "pawlii" src/screens/role-selection` prints nothing.

## Blocked by

- 029 Card family and Separator
- 062 Auth gate: Supabase session / protected routes and role switching
