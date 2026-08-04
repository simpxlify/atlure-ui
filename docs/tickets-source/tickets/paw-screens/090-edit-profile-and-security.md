---
id: "090"
title: "Screens: edit profile and security settings"
repo: atlure-paw
epic: paw-screens
priority: P1
size: L
serialize: "No"
milestone: M5
blocked_by: "033 Input / Textarea / Label / FormField and SearchBar; 034 Switch / Checkbox and RadioGroup; 053 Storage buckets: public pet photos and private ID documents"
labels: "epic:paw-screens; type:screen; flow:profile"
---

# Screens: edit profile and security settings

## Context

References: `atlure-spec-reference/src/app/components/EditProfileScreen.tsx` and `SecurityScreen.tsx`. Both are settings forms reached from the profile tab, both render differently per role, and they share the same `SettingsRow` shape, so they share a ticket. Edit profile is also where a sitter uploads verification documents into the **private** `sitter-documents` bucket — the most sensitive write in the app.

## Scope

Edit profile:

- Display name, bio, phone, city and country, locale and preferred currency — the last two drive every `MoneyLabel` and `DateLabel` in the app, so changing them must take effect without a restart.
- Avatar upload to the `avatars` bucket through `StoragePort`, with the same abandon-safe upload behaviour as the pet form.
- Sitter-only section: headline, about, years of experience, accepted species, service kinds with rates and units, and verification document upload to `sitter-documents`. Show only the verification **status**; never render or link a stored document.
- Explicit save with a dirty indicator and a discard confirmation.

Security:

- Change password with current-password confirmation, change email with the verification flow, active-session list with a sign-out-everywhere action, and account deletion behind a typed confirmation in an `AlertDialog`.
- Privacy toggles: profile discoverability, marketing consent, and analytics consent — the last one must actually gate the analytics client from ticket 104.
- A clear explanation of what account deletion removes and what is retained for legal reasons.

## Out of scope

The profile tab screens themselves (ticket 091). Notification preferences — decide whether they live here or in the notifications screen (ticket 092) and put them in exactly one place; state the decision on the ticket. Two-factor authentication.

## Files you own

The edit-profile and security route files, `src/screens/settings/**`, two lines of `src/navigation/routes.ts`.

## Files you must NOT touch

`src/screens/profile/**` (ticket 091). `src/auth/**` (ticket 062) — call its methods. `src/data/**`. Other route files.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts changing preferred currency from EUR to GBP causes a `MoneyLabel` elsewhere in the tree to re-render with `£` without remounting the app.
3. A test asserts an abandoned avatar pick leaves zero objects in the `avatars` bucket.
4. A test asserts the verification section renders a status only and issues no read of any `sitter-documents` object: `grep -rniE "getPublicUrl|createSignedUrl" src/screens/settings` shows no use against the documents bucket.
5. A test asserts changing password requires the current password and that a wrong one surfaces as a field error, not a generic failure.
6. A test asserts account deletion requires the typed confirmation string before any call is issued.
7. A test asserts turning analytics consent off calls the analytics client's disable path exactly once and that no event is emitted afterwards.
8. A test asserts leaving with unsaved changes prompts a discard confirmation.
9. `git diff --stat src/navigation/routes.ts` shows exactly two changed lines.

## Blocked by

- 033 Input / Textarea / Label / FormField and SearchBar
- 034 Switch / Checkbox and RadioGroup
- 053 Storage buckets: public pet photos and private ID documents
