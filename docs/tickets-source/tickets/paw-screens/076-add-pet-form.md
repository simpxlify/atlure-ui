---
id: "076"
title: "Screen: add and edit a pet"
repo: atlure-paw
epic: paw-screens
priority: P0
size: M
serialize: "No"
milestone: M4
blocked_by: "033 Input / Textarea / Label / FormField and SearchBar; 053 Storage buckets: public pet photos and private ID documents; 065 Supabase adapter passing the same conformance suite as the mock"
labels: "epic:paw-screens; type:screen; flow:pets"
---

# Screen: add and edit a pet

## Context

Reference: `atlure-spec-reference/src/app/components/AddPetForm.tsx` — a small form with no validation and no photo upload. Adding a pet is the third step of the M4 thin slice, so it must actually persist. The prototype stored `age` as a free-text string; the schema stores `birth_date`, so this form collects a date and the display side derives the age.

## Scope

- Fields: name, species (`Select`), breed (optional, with a species-filtered suggestion list), birth date (`Calendar`, past dates only), weight in grams entered in the user's unit preference, and notes.
- Photo: pick from library or camera via `expo-image-picker`, upload to the `pet-photos` bucket through `StoragePort`, with progress, a retry on failure, and no orphaned upload if the form is abandoned — upload on submit, not on pick, or clean up on cancel.
- A separate, clearly marked medical-notes section (vet contact, allergies, medications) writing to `pet_medical_notes`, with a note explaining that a sitter can see it only during an active booking.
- Reuse the same screen for editing an existing pet, keyed by an optional id param, including a destructive delete behind an `AlertDialog`.
- Validation before submit; server `Result` failures map to field or form errors; the submit button is disabled while pending.
- On success, route back to the pet profile (edit) or the dashboard (create) and show a toast.
- Flip this route's `status` to `live`.

## Out of scope

The pet profile display (ticket 077). Sharing a pet with a co-owner. Image cropping or resizing beyond what the picker provides.

## Files you own

The add-pet route file, `src/screens/pet-form/**`, one line of `src/navigation/routes.ts`.

## Files you must NOT touch

`src/screens/pet-profile/**` (ticket 077). `src/data/**`. `src/data/fixtures/**`. Other route files.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts submitting with an empty name blocks submission and shows a required error, with zero `PetPort` calls.
3. A test asserts the birth-date control rejects a future date and that the submitted payload contains `birthDate` as a `YYYY-MM-DD` string and no `age` field.
4. A test asserts picking a photo then cancelling the form results in zero objects left in the `pet-photos` bucket, verified against the mock storage adapter's object list.
5. A test asserts a failed upload renders a retry that re-uploads once and then completes the submit.
6. An integration test against local Supabase creates a pet, reads it back through `PetPort`, and asserts every submitted field round-trips.
7. A test asserts the edit mode prefills every field from the fetched pet and that delete is confirmed through `AlertDialog` before any `PetPort.delete` call.
8. A test asserts the medical-notes explanation text is rendered.

## Blocked by

- 033 Input / Textarea / Label / FormField and SearchBar
- 053 Storage buckets: public pet photos and private ID documents
- 065 Supabase adapter passing the same conformance suite as the mock
