---
id: "043"
title: "Web Input / Textarea / Label and FormField"
repo: atlure-ui
epic: ds-web
priority: P2
size: S
serialize: "No"
milestone: M4
blocked_by: "019 Scaffold @atlure/ui-web sharing cva recipes with the native package; 033 Input / Textarea / Label / FormField and SearchBar"
labels: "epic:ds-web; type:component; area:forms"
---

# Web Input / Textarea / Label and FormField

## Context

The marketing site needs exactly two forms: a sitter-waitlist / contact form and a newsletter signup. That is the whole justification for form controls in `@atlure/ui-web` — there is no product form on web. Native HTML validation plus server-side handling is enough; no form library is warranted.

## Scope

- `Input` rendering `<input>`, `Textarea` rendering `<textarea>`, both using the shared input recipe and supporting an `invalid` state.
- `Label` rendering `<label>` with `htmlFor` correctly wired.
- `FormField` composing label, control, helper text and error, setting `aria-describedby` to the helper or error id and `aria-invalid` when errored.
- Honour native constraint validation attributes (`required`, `type="email"`, `minLength`) and surface `:user-invalid` styling, so the form works with JavaScript disabled.
- A honeypot field helper for spam, since these forms are public and unauthenticated.

## Out of scope

The form submission endpoint or any server action — that belongs to the marketing page ticket that uses it. Product forms. `Select`, `Switch`, `Checkbox`, `RadioGroup` — no marketing page needs them; add later only if one does.

## Files you own

`packages/ui-web/src/components/input.tsx`, `textarea.tsx`, `label.tsx`, `form-field.tsx`, `apps/storybook-web/stories/WebForm.stories.tsx`.

## Files you must NOT touch

`packages/ui/src/**`. Other files under `packages/ui-web/src/components/`. `packages/ui-web/src/index.ts`.

## Acceptance criteria

1. `pnpm --filter @atlure/ui-web test` exits 0.
2. A test asserts `Label` `htmlFor` equals the `Input` `id` and that clicking the label focuses the input.
3. A test asserts `FormField` with an error sets `aria-invalid="true"` and `aria-describedby` pointing at the element containing the error text.
4. A test asserts `Input type="email" required` with the value `nope` fails `checkValidity()` and passes with `a@b.co`.
5. A test asserts the honeypot input is present, has `tabindex="-1"`, `autocomplete="off"` and is hidden from the accessibility tree.
6. `axe` reports zero violations on the WebForm story.

## Blocked by

- 019 Scaffold @atlure/ui-web sharing cva recipes with the native package
- 033 Input / Textarea / Label / FormField and SearchBar
