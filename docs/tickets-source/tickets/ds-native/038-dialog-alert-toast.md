---
id: "038"
title: "Dialog / AlertDialog and Toast"
repo: atlure-ui
epic: ds-native
priority: P1
size: M
serialize: "No"
milestone: M2
blocked_by: "035 Sheet primitive / Select and Picker; 028 Button and IconButton"
labels: "epic:ds-native; type:component; area:overlays"
---

# Dialog / AlertDialog and Toast

## Context

Seven prototype screens import `dialog`, and the emergency, cancel-booking and delete-pet flows need a genuine confirm/destroy pattern. The prototype also imports `sonner` for toasts. On native these need a portal host mounted once at the app root, so the host component must exist in the design system while ticket 058 mounts it.

## Scope

- `PortalHost` mounted once by the app root, plus a `Portal` used by all overlays so they escape parent clipping and render above the tab bar.
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`: centred modal, backdrop dismiss, Android hardware back dismiss, accessibility focus trap, `accessibilityViewIsModal` on iOS.
- `AlertDialog`: same base, but dismissal requires an explicit action, with `destructive` styling on the confirm action and a required `confirmLabel`/`cancelLabel`.
- `Toast` + `useToast()`: a queue with `variant` (`default`, `success`, `error`), auto-dismiss with a configurable duration, swipe to dismiss, safe-area aware, and `AccessibilityInfo.announceForAccessibility` on show so screen-reader users hear it.
- At most one dialog visible at a time; a second `open` while one is showing queues rather than stacking.

## Out of scope

`Sheet` (ticket 035) — reuse it, do not duplicate the backdrop. Mounting the `PortalHost` in the app (ticket 060). Push notifications (ticket 108).

## Files you own

`packages/ui/src/components/dialog.tsx`, `alert-dialog.tsx`, `toast.tsx`, `packages/ui/src/lib/portal.tsx`, `packages/ui/src/lib/use-toast.ts`, `apps/storybook-web/stories/Overlays.stories.tsx`.

## Files you must NOT touch

`sheet.tsx` (ticket 035). Anything in `atlure-paw`. `packages/ui/src/index.ts`.

## Acceptance criteria

1. `pnpm --filter @atlure/ui test` exits 0.
2. A test asserts pressing the backdrop closes a `Dialog` but does **not** close an `AlertDialog`.
3. A test asserts `AlertDialog` calls `onConfirm` once on the confirm action and `onCancel` once on cancel, and that the confirm node carries the destructive class when `destructive` is set.
4. A test with fake timers asserts a toast with `duration={3000}` is removed after 3000 ms and that `announceForAccessibility` was called with its message.
5. A test asserts opening two dialogs shows one at a time and the second appears after the first closes.
6. A test asserts overlays render inside `PortalHost` and throw a clear error message when no host is mounted.

## Blocked by

- 028 Button and IconButton
- 035 Sheet primitive / Select and Picker
