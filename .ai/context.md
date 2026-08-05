# atlure-ui — AI context

The Atlure design system: a pnpm workspace publishing `@atlure/{tokens,tailwind-preset,types,ui,ui-web}`, plus the Storybook workbench. `packages/tokens/src/tokens.ts` is the only file in the entire product where a hex value may appear.

## Authoritative docs — read on demand (do not preload)

Paths are relative to this file. Use the Read tool when the current task needs one; never `@`-import them.

1. `../AGENTS.md` — rules specific to this repo
2. `../CONVENTIONS.md` — Atlure engineering conventions, shared by all four repos
3. `shared/atlure/platform-arch.md` — locked architecture decisions and the reasoning behind them
4. `shared/atlure/styling.md` — **Atlure styling. Tailwind 3.4 + a JS preset. Never apply Estiato's Tailwind v4 doc here.**
5. `shared/atlure/environment-gotchas.md` — machine traps that each cost real time; read before running tooling
6. `shared/atlure/manual-setup.md` — what only David can do, and what is already done

## Cross-project docs — same rule, on demand

- `shared/common/conventions.md`
- `shared/common/git-workflow.md`
- `shared/common/branch-naming.md`
- `shared/common/security.md`
- `shared/common/dependencies.md`
- `shared/common/env-variables.md`
- `shared/common/github-troubleshooting.md`
- `shared/skills/common/handoff.md`
- `shared/frontend/react-patterns.md`
- `shared/frontend/accessibility.md`
- `shared/frontend/testing.md`

## Non-negotiables

- **No code comments.** Self-documenting names instead. The only exception is a genuinely counterintuitive _why_.
- `pnpm` comes from corepack (`corepack enable pnpm`); it is not installed globally. `jq` is not installed at all.
- Never hand-edit anything under a `generated/` directory, or the lockfile.
- Tailwind stays at 3.4 and NativeWind at 4.2. Upgrading either forks the token source of truth.
