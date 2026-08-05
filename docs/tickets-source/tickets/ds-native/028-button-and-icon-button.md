---
id: "028"
title: "Button and IconButton"
repo: atlure-ui
epic: ds-native
priority: P0
size: M
serialize: "No"
milestone: M2
blocked_by: "027 Text primitive and the typography scale"
labels: "epic:ds-native; type:component"
---

# Button and IconButton

## Context

`Button` is the most-used primitive in the prototype — 26 of the 33 screen files import it. It is also half of the M2 gate: a `Button` from the published `@atlure/ui` must render in Atlure orange on a real device and in a web page.

The two platforms share the **API surface**, not the recipe. `@atlure/ui-web` maintains its own cva recipe and does not import this one; `packages/ui-web/src/variants/parity.test.ts` fails if an option name drifts on any axis both expose. Keep this recipe inside the RN-safe Tailwind subset anyway, because that is what makes native work — not because web reads it.

## Scope

- `Button` in `packages/ui/src/components/button/button.tsx` built on RN `Pressable`, forwarding refs.
- Recipe `packages/ui/src/variants/button-variants.ts` with `variant`: `primary` (brand orange), `secondary`, `outline`, `ghost`, `destructive`, `link`; `size`: `sm`, `md`, `lg`, `icon`. Heights come from the preset's token-driven control scale (`h-control-sm`, `h-control-md`, `h-control-lg`, `h-control-icon`) — not a bespoke `buttonHeight` JS lookup, which is what the salvaged tokens did.
- Uses `TextClassContext` so a bare string child gets the right foreground colour per variant.
- `disabled` state applies reduced opacity and blocks `onPress`. `loading` prop renders a spinner and blocks `onPress`.
- `IconButton` as a thin wrapper fixing `size="icon"` and requiring an `accessibilityLabel`.
- Accessibility: `accessibilityRole="button"`, `accessibilityState` reflecting `disabled` and `busy`, minimum 44x44 hit target on every size including `sm`.
- Stories covering the full variant/size matrix plus disabled and loading, light and dark.

## Out of scope

The web `Button` render layer (ticket 041). Any screen usage.

Adding an option to the web recipe purely to keep `parity.test.ts` green is in scope, since a new native option would otherwise fail it.

## Files you own

`packages/ui/src/components/button/**`, `packages/ui/src/components/icon-button/**`, `packages/ui/src/variants/button-variants.ts`, `apps/storybook-web/stories/Button.stories.tsx`.

## Files you must NOT touch

`packages/ui/src/components/text.tsx` and `text-class-context.tsx` (ticket 027) — consume them, do not edit them. `packages/tailwind-preset/**`. `packages/ui/src/index.ts`.

## Acceptance criteria

1. `pnpm --filter @atlure/ui test` exits 0.
2. A test asserts `variant="primary"` resolves to a class string containing `bg-primary`, and `variant="destructive"` to `bg-destructive`. Assert the **resolved recipe output**, not a rendered DOM attribute: `react-native-web` drops `className` entirely, so no render test in `packages/ui` can observe it.
3. A test asserts `onPress` is not called when `disabled` is true, and not called when `loading` is true.
4. A test asserts every `size` produces a resolved minimum height of at least 44 device-independent pixels, and that `accessibilityRole` is `button` on all variants.
5. A test asserts no resolved class string contains `space-x-`, `space-y-`, `divide-`, `grid` or `inline-flex`, and that the base sets `flex-row` explicitly — the recipe stays inside the RN-safe Tailwind subset.
6. The Storybook build renders 24 or more Button permutations and `pnpm lint` exits 0. **Both halves are blocked elsewhere:** the workbench cannot render native components until #61 lands, and there is no root `lint` script until ticket 016 lands.

## Blocked by

- 027 Text primitive and the typography scale
- 061 (issue #61) Storybook native rendering — for the story half of AC6 only
- 016 Root lint script — for the lint half of AC6 only

## Amendments

Amended 2026-08-05 after implementation, agreed with the team lead:

- **Names left as `primary` and `sm`/`md`/`lg`,** not renamed to shadcn's `default`. `primary` is already published at 0.2.0, and the size names deliberately mirror the token scale they resolve to (`size="md"` → `h-control-md` → `controlHeight.md`). Renaming forks component naming away from token naming, which is the duplication this design system exists to prevent.
- **Struck the claim that `@atlure/ui-web` imports this recipe unchanged.** Recipe sharing was reversed in `platform-arch.md`; only the API surface is shared. The original wording predated that decision.
- **Corrected the file paths.** Recipes live in `src/variants/`, components in `src/components/<name>/`. The old `src/lib/recipes/button.ts` never existed, so AC5's grep target was unverifiable.
- **AC2 and AC5 now assert resolved recipe output** rather than a rendered `className`, because `react-native-web` drops the prop.
