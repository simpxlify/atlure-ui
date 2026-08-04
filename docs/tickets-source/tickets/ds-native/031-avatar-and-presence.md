---
id: "031"
title: "Avatar / AvatarGroup and presence indicator"
repo: atlure-ui
epic: ds-native
priority: P1
size: S
serialize: "No"
milestone: M2
blocked_by: "027 Text primitive and the typography scale"
labels: "epic:ds-native; type:component"
---

# Avatar / AvatarGroup and presence indicator

## Context

Pet photos, sitter photos and support-agent photos appear on nearly every screen, and the messaging screens need an online/offline dot (`isOnline` in the prototype's `SupportAgent` and messaging props). Remote images fail, so a fallback path is mandatory rather than optional — the prototype used raw Unsplash URLs with no fallback at all.

## Scope

- `Avatar` in `packages/ui/src/components/avatar.tsx` with `src: string | null`, `fallback` initials, `size`: `xs`, `sm`, `default`, `lg`, `xl`; circular by default with a `shape="rounded"` option for home/property images.
- On image load error or a null `src`, render the initials fallback. Initials are derived from a `name` prop, uppercased, at most two characters.
- A skeleton shimmer state while the image loads.
- `presence` prop: `online`, `offline`, `none` — a dot positioned at the bottom-right, sized proportionally to the avatar, with an `accessibilityLabel` conveying the state to screen readers.
- `AvatarGroup` rendering up to `max` avatars with a `+N` overflow badge, using RN-safe negative margin (not `space-x-*`).
- Stories covering every size, a broken URL, a null src, and both presence states.

## Out of scope

Image upload or cropping (part of ticket 033's image field and the edit-profile screen). A CDN or image-resizing service. Web avatar (ticket 042).

## Files you own

`packages/ui/src/components/avatar.tsx`, `avatar-group.tsx`, `packages/ui/src/lib/recipes/avatar.ts`, `apps/storybook-web/stories/Avatar.stories.tsx`.

## Files you must NOT touch

`text.tsx`, `badge.tsx`, `card.tsx`. `packages/ui/src/index.ts`.

## Acceptance criteria

1. `pnpm --filter @atlure/ui test` exits 0.
2. A test renders `Avatar` with `src={null} name="Sarah Johnson"` and asserts the rendered text is exactly `SJ`.
3. A test fires the image `onError` handler and asserts the fallback initials appear and the image node is gone.
4. A test asserts `presence="online"` renders a node with an `accessibilityLabel` containing `online`, and `presence="none"` renders no such node.
5. A test asserts `AvatarGroup` with 7 children and `max={4}` renders 4 avatars plus a node containing `+3`.
6. `grep -n "space-x-" packages/ui/src/components/avatar-group.tsx` prints nothing.

## Blocked by

- 027 Text primitive and the typography scale
