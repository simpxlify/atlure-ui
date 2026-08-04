---
id: "108"
title: "Push notifications: registration / delivery and deep links"
repo: atlure-paw
epic: quality
priority: P2
size: L
serialize: "No"
milestone: M5
blocked_by: "092 Screen: notifications; 057 Hono business logic: matching / notification fan-out and scheduled jobs; 038 Dialog / AlertDialog and Toast"
labels: "epic:quality; type:feature; area:notifications"
---

# Push notifications: registration / delivery and deep links

## Context

Ticket 057 creates notification rows and ticket 092 renders them in-app; neither delivers to a device. Push is what makes a booking request reach a sitter who is not looking at the app, which is the difference between the marketplace working and not. Permission prompting has to be earned rather than shown at launch, or the denial rate makes the channel useless.

## Scope

- Device token registration via `expo-notifications`, stored per profile per device with the platform, so a signed-out device stops receiving.
- Permission request deferred to the first moment it is contextually justified — after a sitter turns on accepting-requests, or after a parent sends a booking request — with an in-app explanation before the OS prompt. Never at cold start.
- Server delivery from the Hono fan-out path (ticket 057) through Expo's push service, batched, with token invalidation on a rejected send so dead tokens are pruned.
- Notification categories mapped to the kinds ticket 092 renders, each carrying a deep link that opens the correct route.
- Tapping a notification from cold start, from background, and while foregrounded all land on the same route — three distinct code paths that each need testing.
- In-app foreground presentation as a toast rather than an OS banner, using ticket 038's toast.
- Badge count on the app icon kept in sync with the unread count, and cleared when the notifications screen is read.
- Respect the notification preferences from ticket 090: a disabled category is not sent, enforced server-side, not only hidden client-side.
- Quiet hours from the profile's locale, so a request at 3 am does not wake a sitter.

## Out of scope

Email or SMS notification channels. Rich media notifications. Web push — the marketing site does not need it.

## Files you own

`src/notifications/**` in `atlure-paw`, `src/push/**` in `atlure-api`, and the delivery step inside the fan-out job.

## Files you must NOT touch

`src/screens/notifications/**` (ticket 092) and `src/screens/settings/**` (ticket 090). `src/routes/service-requests.ts` beyond the single delivery call. Any `app/` route file.

## Acceptance criteria

1. `npx tsc --noEmit` exits 0 in both repos and `pnpm test` exits 0.
2. A test asserts no permission prompt is issued at cold start, and that it is issued exactly once after the qualifying action, preceded by the in-app explanation.
3. A test asserts a registered token is deleted on sign-out and that no send is attempted for a signed-out profile.
4. A test asserts a rejected send marks the token invalid and that it is excluded from the next batch.
5. A test asserts a disabled notification category is filtered **server-side**: the send batch for a profile with the category off contains zero entries for it.
6. Three tests assert the deep link resolves to the same route from cold start, from background, and while foregrounded.
7. A test asserts a foreground notification renders as a toast and not an OS banner.
8. A test asserts the app badge equals the unread count after delivery and is zero after the notifications screen is read.
9. A test asserts a notification scheduled inside quiet hours for the profile's locale is deferred rather than sent immediately.
10. One real end-to-end delivery to a physical device is verified manually and recorded on the ticket.

## Blocked by

- 038 Dialog / AlertDialog and Toast
- 057 Hono business logic: matching / notification fan-out and scheduled jobs
- 092 Screen: notifications
