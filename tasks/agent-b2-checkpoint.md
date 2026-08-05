# Agent B2 — atlure-ui component wave (continuation)

Started 2026-08-05. Repo: `atlure-ui` (`simpxlify/atlure-ui`).
Predecessor record: `tasks/agent-b-checkpoint.md` on `feature/ds-icons-package` — read it
first, it holds every decision and trap from 026/027/016/028.

## Assignment

Pick up at 029. Sequence: 029 -> 033 -> 039 -> wide batch (030-032, 034-038, 040 native;
041/042/044/045 web). Concurrency cap 2-3 including sub-agents. Never start emulator /
simulator / Docker / Metro.

## Status log

- [x] Read agent B checkpoint, ticket 032 (029) and its audit comment, environment-gotchas
- [ ] 029 Card family / Separator — branch `feature/ds-card-and-separator`
- [ ] 033 Input / Textarea / Label / FormField / SearchBar (#36) — highest-leverage blocker
- [ ] 039 Skeleton / Spinner / EmptyState / ErrorState / ListRow (#42)
- [ ] wide batch

## 029 — Card family and Separator

### Branch base is not `main`, deliberately

`CardTitle` / `CardDescription` must use `Text` typography variants. Ticket 027 (PR #58)
**renames the whole scale**: `heading/title/subtitle/caption` on `main` become
`h1/h2/h3/body/bodySm/label/caption`. A `CardTitle` written against `main`'s `variant="title"`
would break the moment #58 merges. So this branch stacks on `feature/ds-text-typography` and
its PR targets #58 — retarget to `main` once #58 lands, exactly as #62 does.

### Audit said PARTIAL — what was actually missing

`Card`/`CardHeader`/`CardContent`/`CardFooter`/`Separator` already existed on `main` with
3 card tests. Missing: `CardTitle`, `CardDescription`, a `Separator` test, and any assertion
on the default card's classes.

### Decisions

- **Variant names stay `outlined` / `elevated` / `flat` plus an orthogonal `isPressable`.**
  The ticket asks for `default` / `elevated` / `interactive`. Rejected for three reasons, any
  one of them sufficient: `@atlure/ui-web`'s published card already uses
  `elevated/outlined/flat` and `parity.test.ts` fails the moment the shared `variant` axis
  drifts; the web card is ticket 041's file so it cannot be renamed here anyway; and
  `interactive` would fold pressability into the *visual* axis, when a card can legitimately be
  elevated **and** pressable. AC2's substance survives untouched — the default variant is
  `outlined`, which carries both `bg-card` and `border-border/20`. Same judgment as 028's AC2.
- **AC2 and AC5 are asserted against the cva recipes, not the DOM.** `react-native-web` erases
  `className`, so `cardVariants({})` and `separatorVariants({ orientation })` are the only place
  the assertion can be truthful. New files: `variants/card-variants.test.ts`,
  `variants/separator-variants.test.ts`. This follows 028's `button-variants.test.ts`.
- **No `separator.test.tsx`.** A render test could only assert "renders a node", which
  `CONVENTIONS.md` explicitly bans, and could not see the width class at all.
- **`Card` deliberately does not wrap its children in a `TextClassProvider`.** Web gets
  `text-card-foreground` by CSS inheritance, which a child can override with its own class. The
  native provider has the *opposite* precedence — an inherited class beats an explicit `tone`
  prop — so a provider on `Card` would make `<Text tone="muted">` inside a card impossible.
  Card leaves text colour to `Text`'s own default. Only components that must force a colour
  against their own background (`Button`) should provide.
- **`CardTitle` carries `accessibilityRole="header"`**, before the prop spread so a caller can
  override it. `react-native-web` maps it to `role="heading"`, so the composition test queries
  `getByRole("heading")` — a real user-visible assertion rather than a text match.
- Refs: `ViewProps` does not include `ref` under React 19, so `Card`, `CardSectionProps` and
  `Separator` declare `ref?: Ref<ComponentRef<typeof View>>` explicitly. No runtime change —
  React 19 passes `ref` in props and the existing spread already forwarded it.

### AC status

Met: 1 (49 tests, was 36), 2, 3, 4, 5. **AC6 is unrunnable, not skipped** — there is still no
root `lint` script (it arrives with #59) and `apps/storybook-web` cannot render native
components at all (#61), so the card and separator stories the AC asks for would render
unstyled and mislead. `pnpm --filter storybook-web storybook:build` does exit 0.
