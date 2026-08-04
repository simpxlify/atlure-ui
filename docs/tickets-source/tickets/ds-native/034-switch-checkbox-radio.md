---
id: "034"
title: "Switch / Checkbox and RadioGroup"
repo: atlure-ui
epic: ds-native
priority: P1
size: S
serialize: "No"
milestone: M2
blocked_by: "033 Input / Textarea / Label / FormField and SearchBar"
labels: "epic:ds-native; type:component; area:forms"
---

# Switch / Checkbox and RadioGroup

## Context

Four prototype screens use `Switch` (notification preferences, security settings, privacy toggles) and the filter and role-selection flows need checkbox and radio semantics. React Native's built-in `Switch` cannot be styled with `className`, so it needs a custom implementation to carry Atlure orange; that is the main technical content of this ticket.

## Scope

- `Switch` built from `Pressable` + `Animated` thumb translation, tokenised track colours (`bg-primary` when on, `bg-muted` when off), a `size` variant, and a disabled state. Do not wrap RN's `Switch`.
- `Checkbox` with `checked`, `indeterminate`, `disabled`, rendering a check icon from `@atlure/icons`, and a pressable label region.
- `RadioGroup` + `RadioGroupItem` using a context for the selected value, with arrow-key handling on web and correct `accessibilityRole="radio"` plus `accessibilityState.checked` on native.
- `SettingsRow` — a labelled row with description and a trailing control slot, since that is the exact repeated shape in the notifications, security and privacy screens.
- Every control has a minimum 44x44 touch target even when the visual box is smaller.

## Out of scope

Persisting any preference — that is the relevant screen's ticket. Web-specific radio markup (ticket 042).

## Files you own

`packages/ui/src/components/switch.tsx`, `checkbox.tsx`, `radio-group.tsx`, `settings-row.tsx`, `apps/storybook-web/stories/Controls.stories.tsx`.

## Files you must NOT touch

`input.tsx`, `form-field.tsx`, `label.tsx` (ticket 033) — compose them, do not edit. `packages/ui/src/index.ts`.

## Acceptance criteria

1. `pnpm --filter @atlure/ui test` exits 0.
2. `grep -n "from \"react-native\"" packages/ui/src/components/switch.tsx` shows the import list and `grep -n "Switch" ` on that import line finds no RN `Switch` — the custom implementation is required so the track can be `bg-primary`.
3. A test asserts the on-state `Switch` track `className` contains `bg-primary` and the off state does not.
4. A test asserts `Checkbox indeterminate` renders a distinct node from `checked`, and that `accessibilityState.checked` is `"mixed"`.
5. A test asserts pressing a second `RadioGroupItem` changes `onValueChange` to that item's value and that only one item reports `accessibilityState.checked === true`.
6. A test asserts every control's resolved hit target is at least 44x44.

## Blocked by

- 033 Input / Textarea / Label / FormField and SearchBar
