---
"@atlure/ui": minor
---

Extend `Avatar` with a mandatory remote-image fallback path and add `AvatarGroup`.

`Avatar` gains an `xs` size, a `shape` axis (`circle`, `rounded`), a `presence` dot (`online`,
`offline`, `none`) carrying its state in an accessibility label, and a skeleton overlay while a
remote image loads. A failed image now falls back to the initials instead of rendering a broken
image node.

`AvatarGroup` renders up to `max` avatars with a `+N` overflow badge, overlapping them with
React Native-safe negative margins rather than `space-x-*`.

Accessibility labels default to the avatar's `name` plus the presence variant name and carry no
English prose, and `presenceAccessibilityLabel`, `loadingAccessibilityLabel` and
`overflowAccessibilityLabel` let an app localize them.

The image prop is renamed from `uri` to `src`. This is a breaking rename with no downstream
consumers at the time of the change.
