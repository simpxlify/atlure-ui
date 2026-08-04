---
id: "088"
title: "Screen: emergency information"
repo: atlure-paw
epic: paw-screens
priority: P1
size: M
serialize: "No"
milestone: M5
blocked_by: "077 Screen: pet profile; 037 Tabs / SegmentedControl and ScreenHeader"
labels: "epic:paw-screens; type:screen; flow:tracking"
---

# Screen: emergency information

## Context

Reference: `atlure-spec-reference/src/app/components/EmergencyScreen.tsx` — three tabs (`contacts`, `vet`, `medical`) showing emergency contacts, vet information, and allergies, medications, conditions and last vet visit. It is reached with a pet in context, typically during an in-progress booking, and it is the screen where being slow or wrong matters most. Medical data is gated by RLS: a sitter sees it only while a booking covering the pet is active.

## Scope

- Three tabs matching the prototype: emergency contacts, vet, medical.
- Contacts and vet rows expose a one-tap call action via `tel:` and a one-tap directions action opening the platform maps app with the address.
- Medical tab shows allergies, current medications, conditions and last vet visit, sourced from `pet_medical_notes`.
- Owner view can edit each section inline or route to the pet form; sitter view is read-only.
- If the medical fetch returns `forbidden` or empty, render an explanation that access is limited to active bookings, plus a call action for the owner as the fallback path — never a blank tab.
- Offline resilience: the last successfully fetched emergency data for a pet with an active booking is cached locally and rendered with a "last updated" timestamp when offline, because this is the one screen that must work with no signal.
- A prominent local emergency-services note. Numbers differ per EU country, so derive it from the profile's country code and do not hard-code a single number.
- All four states, plus `not-found` for a stale pet id.
- Flip this route's `status` to `live`.

## Out of scope

Any automated alerting, incident reporting workflow or insurance claim flow. Live tracking (ticket 087). Editing medical data in bulk (ticket 076).

## Files you own

The emergency route file, `src/screens/emergency/**`, one line of `src/navigation/routes.ts`.

## Files you must NOT touch

`src/screens/pet-profile/**` (ticket 077) and `src/screens/pet-form/**` (ticket 076). `src/data/**`. Other route files.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts the call action opens a `tel:` URL with the contact's number and the directions action opens a maps URL containing the address.
3. A test asserts a `forbidden` medical result renders the limited-access explanation plus a call-the-owner action, and never an empty tab.
4. A test asserts the emergency-services note is derived from the profile country code: `PT` and `DE` produce different rendered numbers, and `grep -rn "112\|911" src/screens/emergency --include=*.tsx` finds no literal number in JSX.
5. A test asserts an offline read renders cached data with a last-updated timestamp, and that no cache exists for a pet without an active booking.
6. A test asserts the owner view exposes edit affordances and the sitter view does not.
7. A test asserts all three tabs render and that switching tabs issues no refetch of already-loaded data.

## Blocked by

- 037 Tabs / SegmentedControl and ScreenHeader
- 077 Screen: pet profile
