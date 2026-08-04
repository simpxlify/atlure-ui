---
id: "091"
title: "Screens: pet-parent and pet-sitter profile tabs with role switching"
repo: atlure-paw
epic: paw-screens
priority: P1
size: M
serialize: "No"
milestone: M5
blocked_by: "062 Auth gate: Supabase session / protected routes and role switching; 089 Screen: leave a review and the review list; 037 Tabs / SegmentedControl and ScreenHeader"
labels: "epic:paw-screens; type:screen; flow:profile"
---

# Screens: pet-parent and pet-sitter profile tabs with role switching

## Context

References: `atlure-spec-reference/src/app/components/PetParentProfile.tsx`, `PetSitterProfile.tsx` and the overlapping `UserProfile.tsx`. Both take `onRoleSwitch` and `onNavigate`, where `onNavigate` targets exactly six destinations: edit-profile, notifications, security, payment, activity and help-support. They are the same screen with a role branch, so they share a ticket. The role switch is the product's defining interaction — one account, switched, not two logins.

## Scope

- Header: avatar, display name, city, member-since date, and for sitters the verification badge and aggregate rating using the review-list component from ticket 089.
- A role switch control. Switching calls `switchRole`, resets the tab to home and lands on the role-appropriate dashboard, exactly as the prototype's `handleRoleSwitch` does. A profile holding only one role sees an invitation to add the other rather than a disabled toggle.
- A settings list routing to the six destinations from the prototype's `onNavigate`, with the payment destination replaced by the booking-history entry, since there are no payments in v1.
- Parent sections: pets summary and booking history entry.
- Sitter sections: services and rates summary, availability entry, and the reviews received list.
- Sign out with a confirmation.
- All four states, and an explore-mode variant prompting sign-in.
- Flip this route's `status` to `live`.

## Out of scope

Edit profile and security (ticket 090). Notifications (ticket 092), activity and bookmarks (ticket 093), help and support (ticket 094) — only route to them. Changing `AuthProvider`.

## Files you own

The profile route file, `src/screens/profile/**`, one line of `src/navigation/routes.ts`.

## Files you must NOT touch

`src/screens/settings/**` (ticket 090). `src/screens/reviews/**` (ticket 089) — import its list. `src/auth/**`. Other route files.

## Acceptance criteria

1. `npx tsc --noEmit` and `pnpm test` exit 0.
2. A test asserts the route renders the sitter variant when `activeRole` is `pet-sitter` and the parent variant otherwise.
3. A test asserts the role switch calls `switchRole` once, sets the active tab to home, and that the home route then resolves to the other role's dashboard.
4. A test asserts a profile holding only `pet-parent` renders the add-the-other-role invitation and no disabled toggle.
5. A test asserts the settings list renders exactly the six destinations and that each navigates to its route, with the payment slot resolving to booking history and no payment wording present.
6. A test asserts the sitter variant renders the review list component from `src/screens/reviews/`, not a local copy.
7. A test asserts sign out is confirmed before `signOut` is called.
8. A test in explore mode asserts the sign-in prompt renders and zero profile fetches are issued.

## Blocked by

- 037 Tabs / SegmentedControl and ScreenHeader
- 062 Auth gate: Supabase session / protected routes and role switching
- 089 Screen: leave a review and the review list
