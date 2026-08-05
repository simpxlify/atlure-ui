# Agent B — atlure-ui component wave

Started 2026-08-05. Repo: `atlure-ui` (`simpxlify/atlure-ui`).

## Assignment

Ticket sequence: 026 -> 027 -> {028, 029, 033} -> 039 -> wide batch
(030-032, 034-038, 040 native; 041-045 web).

Concurrency cap: 2-3 agents total including sub-agents. Never start
emulator / simulator / Docker / Metro.

## Status log

- [x] Read handoff, platform-arch, environment-gotchas, styling, AGENTS.md, .ai/context.md
- [x] Environment verified (corepack pnpm 11.20.0, install exits 0, baseline build/typecheck/test green at 70 tests)
- [x] 026 @atlure/icons — `packages/icons`, 12 tests, publint + attw green, pack manifest updated
- [x] 027 Text + typography scale — PR #58, `feature/ds-text-typography`. 36 tests in `@atlure/ui`
- [x] 016 hex lint + checksum guard (taken out of sequence) — PR #59,
      `feature/ds-hex-lint-and-checksum`. Unblocks the `pnpm lint` criterion on 027-033
- [x] 028 Button / IconButton — PR #62 (stacked on #58), `feature/ds-button-and-icon-button`.
      48 tests in @atlure/ui, 20 in @atlure/ui-web
- [ ] 029 Card family / Separator
- [ ] 033 Input / Textarea / Label / FormField / SearchBar
- [ ] 039 Skeleton / Spinner / EmptyState / ErrorState / ListRow
- [ ] wide batch

### Filed / folded (agreed with the lead)

- **#61** — Storybook cannot render native components. Blocks a story AC across 027-040.
- **#18** — folded in the per-artifact-checksum limitation from 016.
- **#60** — tokens/types CJS resolution fix (Agent C report).

## Notes

### 026 findings worth carrying forward

- **lucide dropped its brand glyphs in v1.** `Chrome` and `Facebook`, which the prototype
  used for social sign-in, do not exist in `lucide-react@1.28` or `lucide-react-native@1.28`.
  The social buttons need a different icon source; that is a brand-asset call (ticket 109).
- **Icon name to module path is not mechanical.** `AlertCircle` lives in `circle-alert`,
  `Edit3` in `pen-line`, `CheckCircle` in `circle-check-big`, `HelpCircle` in
  `circle-question-mark`. The generator reads the mapping out of lucide's own barrel; a
  kebab-case heuristic would have silently produced wrong paths.
- **The native entry cannot be `import`ed in bare Node**, by any package. `lucide-react-native`
  pulls `react-native-svg`, which pulls `react-native`, whose source is Flow-typed and only
  parseable by Metro/Babel. Ticket 026 AC2 asks for both entries to load in Node without
  throwing; only the DOM entry can. Conditional *resolution* is provable and is tested.
- **Vitest externalises `lucide-react-native`**, so `resolve.alias` does not reach inside it.
  It has to be listed in `test.server.deps.inline` before any RN-facing alias applies.
- Importing the lucide barrel under vitest costs ~19s. Deep per-icon imports cut that to
  under 3s — and are required anyway, because Metro does not tree-shake the 6000-icon barrel.

### 027 findings — these change how every native component gets tested

- **`react-native-web` drops `className` entirely.** `<Text variant="h1" className="text-destructive">`
  renders as `<div dir="auto" class="css-text-146c3p1">`. So with **this package's current harness**
  (vitest + jsdom + the `react-native` → `react-native-web` alias) no test in `packages/ui` can
  assert a resolved class through the DOM, which is why none of the existing ones do. Put class
  composition in a co-located `utils.ts` (the barrel generator treats it as internal) and
  assert the function. Any ticket asking for a `className` render assertion needs amending.
- **That limit is the harness, not NativeWind** — corrected by Agent C, who verified the
  alternative in `atlure-paw`. Under the native `jest-expo` preset with `nativewind/test`, which
  drives NativeWind's **native** runtime (`react-native-css-interop`) rather than the web output,
  `className="bg-primary"` resolves to a real style object — `{ backgroundColor: "hsla(20.5, 90.2%,
  48.2%, 1)" }`, i.e. the brand orange. `react-native-web` is not installed there at all.
  So if `atlure-ui` ever wants a genuine "the class landed" assertion, it needs a **second**
  test project on the native preset; do not try to make the react-native-web suite assert a style
  it structurally cannot carry. Agent C offered their `jest.config.js` and
  `nativewind-transform.native.test.tsx` to lift wholesale. Their trap to inherit: the
  `transformIgnorePatterns` must be **path-position-independent** (`node_modules/(?!.*(...))`),
  because pnpm's `.pnpm/` nesting defeats the conventional shape.
- **Consequence for ticket 061:** it is still device-only, but what it *uniquely* proves has
  narrowed to **Metro's CSS injection and the on-device runtime**. The Babel transform, the preset
  and the token variables are all now proven at code level in `atlure-paw`. If the device check
  fails, look at Metro and the runtime first.
- **`apps/storybook-web` cannot render native components at all.** It depends only on
  `@atlure/ui-web`; no `@atlure/ui`, no `react-native` alias, no NativeWind web pipeline.
  A native story added today would render unstyled and mislead. `@storybook/react-native-web-vite`
  is the real fix and deserves its own ticket. This blocks a story criterion across 027-040.
- **`TextClassProvider` precedence is deliberate:** inherited class beats an explicit `tone`
  prop, and only `className` beats the provider. So `<Button>` cannot be silently un-styled by
  a caller passing `tone`. 028 and 029 depend on this.

### 016 finding

- The checksum guard was a genuine no-op: the tokens `test` script ran `generate` first,
  rewriting every artifact **and** `checksum.json` before comparing. Now `compile:tools` only.
  It still cannot name *which* artifact was edited, because `checksum.json` holds one combined
  sha256 — per-artifact checksums need a generator change that ticket 016 forbids.
- `apps/storybook-web/scripts/verify-theme.mjs` hardcodes `rgb(234, 88, 12)`. Exempted from the
  lint rule rather than rewritten; it should derive from `@atlure/tokens`.

### Packaging defects found from the consumer side (reported by Agent C, atlure-paw)

- **`@atlure/tokens` and `@atlure/types` declared only `types` + `import`** on their root
  export, with no fallback, so any resolver not matching `import` failed *outright* with
  `ERR_PACKAGE_PATH_NOT_EXPORTED` — jest, postcss configs, any `*.config.js`. Fixed in PR #60
  by adding a `default` condition after `import`. `@atlure/ui` and `@atlure/icons` already had
  one; these two were the only stragglers.
  Cost `atlure-paw` an absolute-path `require()` of `dist/navigation.js` plus a jest
  `moduleNameMapper`. Both can be deleted once a release publishes — not before.
- Agent C does **not** need a holding action for the preset-types gap: they exempted the two
  affected files in `atlure-paw`'s own `eslint.config.js`, so that repo is at 0 errors / 0
  warnings today. It is off 017's critical path.
- **`@atlure/tailwind-preset` ships no `types`** (`types` undefined, `exports` a bare string
  target), so consumers must `require()` it and trip `@typescript-eslint/no-require-imports`.
  Deliberately not fixed: its only entry is `generated/index.js` and `AGENTS.md` forbids
  hand-editing under `generated/`, so a hand-written `index.d.ts` cannot sit beside it. Needs a
  decision — a `types/` directory outside `generated/`, or teach the generator to emit the
  `.d.ts` so it stays under the checksum guard. Belongs to ticket 017 (#20).

### NativeWind test-harness traps (from Agent C, verified empirically there)

- **`nativewind/test`'s `render` hard-overrides `presets`** with its own. A custom preset can
  only be injected as `config.theme`. Do not expect `@atlure/tailwind-preset` to apply through
  `presets` in a NativeWind render test.
- **`nativewind/test` has an undeclared dependency on `@tailwindcss/container-queries`.**
- **Tailwind's content scan does traverse the pnpm symlink into `node_modules/@atlure/ui/src`**,
  probed with `h-control-md` (a class that exists nowhere else). This is the first actual
  evidence the untranspiled-source shipping strategy works from the consumer side — it had been
  assumed, not proven, and the whole `@atlure/ui` design rests on it.

### 028 decisions worth not re-litigating

- **Variant/size names stay `primary` and `sm/md/lg`.** Ticket 028 asks for shadcn's
  `default` and `sm/default/lg/icon`. Rejected: `primary` is published at 0.2.0, the size names
  mirror the token scale they resolve to (`size="md"` -> `h-control-md` -> `controlHeight.md`),
  and renaming would break parity with web or force a cross-package API break.
- **Adding `size="icon"` to native emptied the parity allow-list.** `OPTION_DRIFT_ALLOWED` now has
  no entry for `button` — web already had `icon` and the gap was parked there. Keep it empty.
- **Ticket 028's Context paragraph is wrong** where it says the cva recipe is "imported unchanged
  by `@atlure/ui-web`". Recipe sharing was reversed in `platform-arch.md`; only the API surface is
  shared. Do not act on that line in 041 either.
- **`h-control-*` over `h-9`/`h-10`/`h-12`.** The AC's intent was to avoid a JS height lookup;
  `h-control-md` is a preset class driven by tokens, whereas `h-10` hardcodes a size outside them.
- Web `Button` defaulted to `type="submit"` and submitted any form it sat in. Fixed to
  `type="button"`, applied before the prop spread so an explicit `type` still wins, and only on the
  real `button` element (not when `asChild` renders an `<a>`).
