# Agent B2 — 033 form controls

Branch `feature/ds-form-controls`. Companion to `tasks/agent-b2-checkpoint.md` (029, on
`feature/ds-card-and-separator`) and `tasks/agent-b-checkpoint.md` (026/027/016/028).

## Base is a merge of two feature branches

Ticket 033 declares **both** 026 and 027 as blockers and neither was on `main` when this
started, so the branch is `feature/ds-text-typography` with `feature/ds-icons-package` merged
in. `SearchBar` needs real `Search` and `X` glyphs; `Textarea`'s counter and `FormField`'s
messages need the renamed `Text` scale. The PR targets #58 and should be retargeted to `main`
once #57 and #58 both land.

## Decisions

- **`@atlure/ui` now depends on `@atlure/icons`.** `SearchBar` is specified as an `Input` preset
  *with* a search icon and a clear affordance, so the design system has to own those glyphs —
  pushing them out as required props would recreate the per-screen drift `FormField` exists to
  prevent. Consequence to know: the barrel pulls `search-bar`, so `react-native-svg` becomes a
  real peer requirement for every `@atlure/ui` consumer. It is declared as such. The fixed
  changeset version group keeps the two packages moving together.
  Note this diverges from `IconButton`, which takes its icon as a `ReactNode` — that stays
  correct for a *generic* button; the difference is that `SearchBar` has one specific glyph.
- **`FormField` associates its control through React context, not `cloneElement`.** React Native
  has no DOM-level label association, so a provider is the same mechanism `TextClassProvider`
  already uses for text inheritance. `Input`/`Textarea` read `useFormFieldControl()` and an
  explicit prop always beats the field state (`<Input isInvalid={false}>` inside an errored
  field stays valid). No cloning, no prop drilling, and a bare `<Input>` outside a field is
  unaffected.
- **Required is announced with `aria-required` on the control; the asterisk is decorative.**
  First attempt put an `accessibilityLabel` on the marker; the accessible name came out as
  `"Emailrequired"` — the name computation concatenates inline nodes with no separator. So the
  marker is now `aria-hidden` and the *field* carries the requirement, which is also the correct
  semantics. This removed the `requiredAccessibilityLabel` prop, and with it an i18n string.
  **Known gap:** React Native has no native equivalent of `aria-required`, so on a device the
  requirement is conveyed only by the visual asterisk. Reported on the ticket.
- **Placeholder colour is `placeholder:text-muted-foreground`, not a JS token lookup.** Verified
  that NativeWind 4.2 registers a `placeholder` variant that rewrites `color` to
  `placeholderTextColor` (`nativewind/dist/tailwind/native.js`), and `@atlure/ui-web`'s input
  already uses the same class, so this is parity rather than invention. Nothing anywhere in
  `packages/ui/src` reads a colour at runtime and this keeps it that way.
- **The decorative leading icon slot is `pointer-events-none`.** Without it the wrapper swallows
  taps aimed at the field's left padding. The trailing slot deliberately keeps its pointer
  events, because that is where `SearchBar`'s clear button lives. Reached this via a class rather
  than `pointerEvents="box-none"`, which `react-native-web` now warns is deprecated — the
  warning showed up in the test output.
- **`Textarea` row heights use `min-h-16/24/28/40`, which is a token gap.** The preset's
  `minHeight` scale only has `control-*` entries (2.25/2.5/3rem), all far too short for a
  textarea, and 033 forbids touching the preset. Reported on #18 rather than worked around
  silently. A `textareaHeight` token group would let these become `min-h-textarea-*`.
- **New native-only variant axes `hasLeadingIcon` / `hasTrailingIcon`** are recorded in
  `parity.test.ts`'s `PLATFORM_ONLY_AXES`; the web input has no icon slots until #46.

## AC status

Met: 1 (36 -> 59 tests), 2, 3, 4, 5 (`grep -rn "inputHeight\|buttonHeight" packages/ui/src`
prints nothing). AC6 unrunnable, same two reasons as 029: no root `lint` script until #59, and
`apps/storybook-web` cannot render native components (#61).

No test for `FormScrollView`: it is a thin `KeyboardAvoidingView` + `ScrollView` wrapper whose
entire value is platform keyboard behaviour, which neither jsdom nor `react-native-web` exhibits.
A test there could only assert that children render, which `CONVENTIONS.md` bans.
