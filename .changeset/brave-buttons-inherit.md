---
"@atlure/ui": minor
"@atlure/ui-web": minor
---

Add `IconButton`, a `link` variant and an `icon` size to the native `Button`, and wire its label colour through `TextClassProvider` so nested `Text` inherits it instead of each caller repeating classes.

Adding `icon` to native closes a real parity divergence: web already had it and the gap was sitting in the parity test's allow-list, which is now empty for `button`. `link` was added to both platforms in the same shape — underlined on native, which has no `hover:`.

**Fixes a defect in the web `Button`:** it never set `type`, so it defaulted to `submit` and any `Button` inside a `form` submitted it on click. It now defaults to `type="button"`, and a caller passing `type="submit"` still wins.
