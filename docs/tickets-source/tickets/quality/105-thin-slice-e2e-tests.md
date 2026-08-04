---
id: "105"
title: "End-to-end tests for the M4 thin slice on a real device"
repo: atlure-paw
epic: quality
priority: P0
size: L
serialize: "No"
milestone: M4
blocked_by: "079 Screen: booking request and confirmation summary; 076 Screen: add and edit a pet; 071 Screen: find a sitter — search / results / paging and states"
labels: "epic:quality; type:test"
---

# End-to-end tests for the M4 thin slice on a real device

## Context

The M4 milestone is a single journey: sign up, choose a role, add a pet, search sitters by radius, open a sitter profile, request a booking — on a real device against real Supabase. Unit tests for each screen cannot prove that journey holds together, and the two highest-risk failure modes on this project (a dead `className` prop and a broken published `exports` map) both produce apps that pass unit tests and fail in the user's hands.

## Scope

- A Maestro (or Detox) suite driving the full M4 journey on a device or emulator against a seeded Supabase environment, not the mock adapter.
- Per-step assertions rather than only a final one, so a failure names the step: account created, role set, pet visible, results returned for a known radius, profile opened, booking created with status `requested`.
- A visual assertion at one step that a primary button is actually orange, guarding the NativeWind failure mode found in ticket 061 — a screenshot pixel check, not a class-name check.
- Test data isolation: each run creates a fresh account with a unique email and cleans up afterwards, so runs are repeatable and do not accumulate state.
- A second, shorter suite for the role switch: switch to sitter, see the sitter dashboard, switch back.
- CI: run on every push to main and nightly against a preview build, on both platforms.
- Flake policy: a failing step retries at most once, and a test that fails twice fails the build. Do not add blanket sleeps; wait on visible elements.

## Out of scope

Full coverage of all 25 screens. Messaging and tracking journeys, which arrive in M5 — add them in a follow-up rather than expanding this ticket. Load testing.

## Files you own

`e2e/**`, `.github/workflows/e2e.yml`, `scripts/e2e-seed.ts`.

## Files you must NOT touch

Any screen source. `src/data/**`. If a screen lacks a stable test id, add it in that screen's own ticket rather than editing it here — list the needed ids on this ticket.

## Acceptance criteria

1. `pnpm e2e:ios` and `pnpm e2e:android` both exit 0 against a seeded environment.
2. The suite asserts each of the six journey steps individually, and a forced failure of any one step produces output naming that step.
3. A screenshot assertion samples the request-booking primary button and asserts the RGB value is within 5 per channel of the token orange.
4. A test asserts the created booking exists in Supabase with status `requested`, queried directly rather than read from the UI.
5. Two consecutive full runs both pass with no manual cleanup between them, proving isolation.
6. `grep -rn "sleep\|wait(" e2e | grep -v "waitFor"` finds no fixed-duration sleeps.
7. `gh run list --workflow e2e.yml --limit 1 --json conclusion --jq '.[0].conclusion'` prints `success`.

## Blocked by

- 071 Screen: find a sitter — search / results / paging and states
- 076 Screen: add and edit a pet
- 079 Screen: booking request and confirmation summary
