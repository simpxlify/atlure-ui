---
id: "077"
title: "Screen: pet profile"
repo: atlure-paw
epic: paw-screens
priority: P1
size: M
serialize: "No"
milestone: M4
blocked_by: "076 Screen: add and edit a pet; 031 Avatar / AvatarGroup and presence indicator; 032 MoneyLabel / DistanceLabel / DurationLabel and DateLabel"
labels: "epic:paw-screens; type:screen; flow:pets"
---

# Screen: pet profile

## Context

Reference: `atlure-spec-reference/src/app/components/PetProfile.tsx` — a photo carousel (`currentImageIndex`), pet details, and sections for care history and past sitters. It is reached from the parent dashboard, from the sitter dashboard by tapping a pet inside a home, and from a booking. That means it renders for two different viewers with different permissions: the owner sees everything and can edit; a sitter with an active booking sees care details and medical notes but cannot edit.

## Scope

- Photo carousel with page indicators, falling back to the `Avatar` initials treatment when there is no photo.
- Details: name, species, breed, age derived from `birth_date` via `DateLabel`'s relative mode or an explicit age helper, weight in the user's unit.
- Owner view: edit and delete affordances routing to the pet form, plus the medical-notes section always visible.
- Sitter view: read-only, with medical notes shown only while a booking covering this pet is `accepted` or `in-progress`, and an explanatory line when they are withheld. The gate is enforced by RLS, so the screen must handle the `forbidden` or empty case gracefully rather than assuming access.
- Booking history for this pet with sitter avatars and dates, cursor-paged.
- An emergency action for a pet with an in-progress booking, routing to the emergency screen with the pet id.
- All four states, including a `not-found` case for a stale deep link.
- Flip this route's `status` to `live`.

## Out of scope

The pet form (ticket 076). Emergency screen content (ticket 088). Leaving a review (ticket 089).

## Files you own

The pet route file, `src/screens/pet-profile/**`, one line of `src/navigation/routes.ts`.

## Files you must NOT touch

`src/screens/pet-form/**` (ticket 076). `src/screens/dashboard-*/**`. `src/data/fixtures/**`. Other route files.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts the owner view renders edit and delete affordances and the sitter view renders neither.
3. A test asserts a sitter with an `accepted` booking sees the medical-notes content, and a sitter with only a `completed` booking sees the withheld explanation instead.
4. A test asserts a `forbidden` result from the medical-notes fetch renders the withheld explanation and no error dialog.
5. A test asserts the age shown for a pet with `birth_date` three years and one month ago renders as 3 years, and that `grep -rn "age:" src/screens/pet-profile` finds no string age field.
6. A test asserts a `not-found` result renders the not-found state with a path back to the dashboard.
7. A test asserts the emergency action appears only when a booking covering the pet is `in-progress`.
8. A test asserts the carousel indicator count equals the photo count and that a pet with no photo renders the initials fallback.

## Blocked by

- 031 Avatar / AvatarGroup and presence indicator
- 032 MoneyLabel / DistanceLabel / DurationLabel and DateLabel
- 076 Screen: add and edit a pet
