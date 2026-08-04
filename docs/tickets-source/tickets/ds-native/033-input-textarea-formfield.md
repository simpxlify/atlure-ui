---
id: "033"
title: "Input / Textarea / Label / FormField and SearchBar"
repo: atlure-ui
epic: ds-native
priority: P0
size: M
serialize: "No"
milestone: M2
blocked_by: "027 Text primitive and the typography scale; 026 @atlure/icons: one lucide wrapper for native and web"
labels: "epic:ds-native; type:component; area:forms"
---

# Input / Textarea / Label / FormField and SearchBar

## Context

The prototype has no real forms — no validation, no error display, no keyboard handling — yet signup, add-pet, edit-profile, leave-review and support-ticket screens all need them. `FormField` is the piece that stops each screen agent inventing its own error layout. Input heights come from the Tailwind height scale so `h-10` resolves identically on both platforms; the salvaged tokens used a bespoke `inputHeight` JS lookup that only worked on native.

## Scope

- `Input` wrapping RN `TextInput`: `size` variants, `invalid` state, optional leading and trailing icon slots, `editable=false` styling, correct `placeholderTextColor` from tokens.
- `Textarea` with `rows`-equivalent min height, `multiline`, and an optional character counter.
- `Label` with a required-field marker, wired to its input via `nativeID`/`accessibilityLabelledBy`.
- `FormField` composing `Label` + control + helper text + error text, where the error replaces helper text and sets `accessibilityInvalid`. Accepts `error?: string`.
- `SearchBar` — an `Input` preset with a leading search icon, a clear affordance when non-empty, `returnKeyType="search"`, and a `debounceMs` prop defaulting to 300 that debounces `onChangeDebounced`.
- Keyboard handling helper: a `FormScrollView` that wraps content in `KeyboardAvoidingView` with the correct iOS/Android behaviour, so every form screen gets it for free.

## Out of scope

A form state library or schema validation — screens own their own validation logic; this ticket provides display only. Image/file pickers. The web input (ticket 042).

## Files you own

`packages/ui/src/components/input.tsx`, `textarea.tsx`, `label.tsx`, `form-field.tsx`, `search-bar.tsx`, `form-scroll-view.tsx`, `packages/ui/src/lib/recipes/input.ts`, `apps/storybook-web/stories/Form.stories.tsx`.

## Files you must NOT touch

`text.tsx`, `button.tsx`. `packages/tailwind-preset/**` — if the height scale lacks an entry, report on ticket 015. `packages/ui/src/index.ts`.

## Acceptance criteria

1. `pnpm --filter @atlure/ui test` exits 0.
2. A test asserts `FormField` with `error="Required"` renders the error string, hides the helper text, and sets `accessibilityState.invalid` (or `aria-invalid` equivalent) on the control.
3. A test asserts `Label` and its `Input` share an id, so `accessibilityLabelledBy` on the input equals the label's `nativeID`.
4. A test with fake timers asserts `SearchBar` calls `onChangeDebounced` exactly once for three keystrokes within 300 ms, and that pressing clear emits an empty string immediately.
5. `grep -n "inputHeight\|buttonHeight" packages/ui/src` prints nothing — heights come from Tailwind classes.
6. `pnpm lint` and the Storybook build both exit 0, with stories for default, focused, invalid and disabled states.

## Blocked by

- 026 @atlure/icons: one lucide wrapper for native and web
- 027 Text primitive and the typography scale
