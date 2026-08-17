---
"@atlure/ui-web": minor
---

feat(ui-web): IconButton mirroring the native @atlure/ui counterpart (ticket 041).

Adds a square `<button>` at `size="icon"` from the shared button recipe with a required `aria-label`, spinner-swap `isLoading` state (also flips `aria-busy` and `disabled`), and the same `type="button"` default the wave-6 form-submit fix already applied to `Button`. Also adds Badge unit tests and a Storybook page for the icon variant alongside the existing Button and Badge stories.
