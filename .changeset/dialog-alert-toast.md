---
"@atlure/ui": minor
---

Add `Dialog`, `AlertDialog`, `Toast` and the overlay host they queue through.

`PortalHost` mounts once at the app root and owns the overlay queue, so at most one dialog is visible
at a time and a second one opened while the first is showing waits its turn instead of stacking.
Overlays throw a named error when no host is mounted rather than failing silently.

`Dialog` is a centred modal with `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogContent`
and `DialogFooter`. It closes on backdrop press and on the Android hardware back button, marking that
event handled. `AlertDialog` shares the base but cannot be dismissed implicitly: it renders no
backdrop affordance and no back handler, so only the required `confirmLabel` or `cancelLabel` action
closes it, with the confirm action painted from the destructive token when `isDestructive` is set.

`ToastProvider` plus `useToast()` give a queue with `default`, `success` and `error` variants,
per-toast auto-dismiss duration, swipe to dismiss, and
`AccessibilityInfo.announceForAccessibility` on show so screen-reader users hear it.

The overlay backdrop now lives in one place, `overlayBackdropClassName`, shared by `Sheet` and the
dialogs rather than duplicated.

The success toast paints from the `success` semantic token, which arrives in a separate tokens change.
