---
id: "035"
title: "Sheet primitive / Select and Picker"
repo: atlure-ui
epic: ds-native
priority: P0
size: M
serialize: "No"
milestone: M2
blocked_by: "029 Card family and Separator; 033 Input / Textarea / Label / FormField and SearchBar"
labels: "epic:ds-native; type:component; area:overlays"
---

# Sheet primitive / Select and Picker

## Context

Four prototype screens use a DOM `<select>`, which does not exist on native. The mobile idiom is a bottom sheet, so `Select` is implemented on top of a `Sheet` primitive. `Sheet` is also the base for the sitter filter panel (`FilterModal` in the prototype, a 12 KB screen) and the quick-actions panel, so it must land before those screens start.

## Scope

- `Sheet` in `packages/ui/src/components/sheet.tsx`: a bottom sheet with a backdrop, drag-to-dismiss, snap points, safe-area-aware padding, and focus/back-button handling (Android hardware back closes it).
- Sheet must render above the tab bar and must trap accessibility focus while open.
- `Select` + `SelectItem`: a trigger styled like `Input`, opening a `Sheet` listing options with a check mark on the selected one, a `placeholder`, and `onValueChange`. Generic over the option value type — no `any`.
- `Picker` — a multi-select variant returning an array, used by the filters.
- `useSheet()` hook exposing imperative `open`/`close` for screens that need to trigger a sheet from a header action.
- Reduced-motion respect: skip the slide animation when the OS setting is on.

## Out of scope

The filter panel's actual filter fields (ticket 070) — that screen composes this. `Dialog` and `AlertDialog` (ticket 038). Calendar (ticket 040).

## Files you own

`packages/ui/src/components/sheet.tsx`, `select.tsx`, `picker.tsx`, `packages/ui/src/lib/use-sheet.ts`, `apps/storybook-web/stories/Sheet.stories.tsx`.

## Files you must NOT touch

`input.tsx`, `card.tsx`, `dialog.tsx`. `packages/ui/src/index.ts`.

## Acceptance criteria

1. `pnpm --filter @atlure/ui test` exits 0.
2. A test asserts opening a `Sheet` renders its children and pressing the backdrop calls `onClose` exactly once.
3. A test simulates the Android hardware back event and asserts the sheet closes and the event is marked handled.
4. A test asserts `Select` shows the `placeholder` with no value, opens a sheet on press, and calls `onValueChange` with the pressed option's value; a `@ts-expect-error` case proves passing an option value outside the declared union fails typecheck.
5. A test asserts `Picker` returns an array with two entries after two selections and that deselecting removes one.
6. A test with the reduced-motion accessibility flag mocked to true asserts the animation duration used is 0.

## Blocked by

- 029 Card family and Separator
- 033 Input / Textarea / Label / FormField and SearchBar
