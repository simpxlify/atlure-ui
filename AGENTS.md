# Working rules for this repo

Standing rules. They apply to every change, human or agent.

**Read `CONVENTIONS.md` first** — it holds the shared Atlure engineering conventions (naming, branches, SOLID/YAGNI/KISS, mobile-first, required UI states, file organisation, React patterns, i18n, testing, PR format, stacked worktrees, self-review checklist). This file covers only what is specific to `atlure-ui`.

## Absolute

- **No code comments.** No `//`, no `/* */`, no explanatory `#` in YAML. Use self-documenting names instead. The only justified exception is a genuinely counterintuitive *why* — a lint suppression, a library-bug workaround, a non-obvious platform rule — which should be rare enough to count on one hand. Never comment test files.
- **Never hand-edit anything under a `generated/` directory.** A committed checksum will fail the tests, and CI runs `git diff --exit-code` after building. Change `packages/tokens/src/tokens.ts` and regenerate.
- **Never hand-edit `pnpm-lock.yaml`.** On a conflict, take the incoming version and re-run `pnpm install`.
- **Never publish from a laptop.** Releases go through the release workflow only. The predecessor package shipped 28 versions in 16 days by publishing locally.

## Environment

`pnpm` is not installed globally on the primary dev machine; it comes from corepack:

```
corepack enable pnpm
```

Pinned to `pnpm@11.20.0` via `packageManager`. Note that pnpm 11 **no longer reads the `pnpm` field in `package.json`** — settings belong in `.npmrc` or `pnpm-workspace.yaml`.

Node is pinned by `.nvmrc` (22.16.0). The tokens package deliberately avoids `esbuild`, `tsx` and `vitest`, using only `typescript` and Node's built-in test runner.

## Versions are pinned deliberately

Tailwind is held at **3.4.x** and NativeWind at **4.2.x**. This is not staleness. NativeWind 4 is built on Tailwind 3.4; Tailwind 4 replaced JS presets with CSS-first `@theme`, which would make a single preset shared between web and React Native impossible — the exact duplication this repo exists to prevent. NativeWind 5 is preview-only and requires Tailwind 4. **Do not "helpfully" upgrade either.**

## Package boundaries

- No cross-package deep imports. Import from a package's public entry point, never `@atlure/x/src/...`.
- `@atlure/tokens` has no runtime dependencies and must stay that way.
- `@atlure/types` is domain types only — no runtime code, no dependencies.
- `@atlure/ui` (React Native) ships **untranspiled TypeScript source**, never compiled output. NativeWind's `className` is a Babel-time JSX transform; precompiling makes it a silently dead prop and every component renders unstyled. This is why `react-native-builder-bob` is not used here.
- Shared cva variant recipes must use the **React Native-safe Tailwind subset**: no `space-x-*`, no `divide-*`, no `grid`, no descendant selectors. Use `flex-row` explicitly, since React Native defaults to column.

## Changes

- A changeset is required for any change under `packages/`.
- Conventional commit messages.
- Open pull requests as **drafts**.
- Run the targeted tests for what you changed before committing, not the whole suite.

## Verification that actually proves something

A passing typecheck does **not** prove a styling change works on React Native. The only proof that NativeWind is applying classes is a component rendering the expected color on a real device or simulator. Claim it works only if you saw it work.
