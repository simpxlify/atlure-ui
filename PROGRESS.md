started

- read CONVENTIONS.md, AGENTS.md, tickets 019 + 025
- confirmed `packages/ui` does not exist on `feature/ui-native` yet (nothing committed there), so cva recipes are defined locally behind a single swap point
- added `packages/ui-web/package.json` and `apps/storybook-web/package.json`
- `corepack enable pnpm` + `pnpm install`: dependencies installed, exit code 1 from `ERR_PNPM_IGNORED_BUILDS` (esbuild 0.25.12 / 0.27.7). Expected per brief; not looping on it.
- set `allowBuilds: esbuild: true` in `pnpm-workspace.yaml` (it shipped as the literal placeholder `set this to true or false`, and `ERR_PNPM_IGNORED_BUILDS` made *every* `pnpm run` fail its deps-status check, not just install). Install now exits 0.
- `packages/ui-web` complete: variants (shared + layout), Button/Card/Badge/Input/Accordion/Container/Stack, cn helper
- typecheck 0, tests 15/15 pass, tsup build produces ESM+CJS+d.ts+d.cts for both entries
- `npm pack --dry-run` lists only `dist/`, `README.md`, `package.json`; no `react-native` anywhere
