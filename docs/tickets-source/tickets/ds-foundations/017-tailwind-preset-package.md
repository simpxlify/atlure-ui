---
id: "017"
title: Publish @atlure/tailwind-preset with self-configuring content globs
repo: atlure-ui
epic: ds-foundations
priority: P0
size: M
serialize: "Yes"
milestone: M1
blocked_by: "013 Scaffold the atlure-ui pnpm workspace with pinned dependencies; 015 Token parity test suite across all six generated artifacts"
labels: "epic:ds-foundations; type:package; area:tokens; serialize"
---

# Publish @atlure/tailwind-preset with self-configuring content globs

## Context

Both `atlure-paw` (NativeWind 4.2.6) and `atlure-web` (Tailwind 3.4.19) consume one generated Tailwind preset, which is how a single token set serves both platforms. `@atlure/ui` ships **untranspiled TypeScript source**, so every consumer must add the package path to their Tailwind `content` array or every class silently fails to generate. Encoding that path in the preset's own `content` array makes it automatic instead of a documentation problem.

## Scope

- Create `packages/tailwind-preset` publishing `@atlure/tailwind-preset`. Its `theme` content is **generated** by the tokens generator, not hand-written — this package only wraps and publishes it.
- The preset's own `content` array includes `require.resolve`-derived globs for `@atlure/ui` and `@atlure/ui-web` source, so a consumer extending the preset picks up DS classes without extra config.
- `darkMode: "class"` for web and the NativeWind-compatible equivalent, so both platforms toggle themes identically.
- A README section, written for an agent, showing the exact `tailwind.config.js` a consumer writes: `presets: [require("@atlure/tailwind-preset")]` and nothing else about colours.
- A test asserting the resolved config exposes `theme.colors.primary`, `theme.borderRadius`, `theme.spacing` and `theme.fontSize` entries matching the token source.

## Out of scope

Editing the generator or `tokens.ts`. Any component class usage. NativeWind's `global.css` import wiring in consumers (tickets 058, 094).

## Files you own

`packages/tailwind-preset/**`.

## Files you must NOT touch

`packages/tokens/**`. The generated theme fragment must be consumed as-is; if it is wrong, report on ticket 015 rather than patching here. **Component tickets extend styling via `className` only and must never edit this package** — after this ticket lands, the package is frozen.

## Acceptance criteria

1. `pnpm --filter @atlure/tailwind-preset test` exits 0.
2. `node -e "const p=require('@atlure/tailwind-preset'); if(!p.theme.extend.colors.primary) process.exit(1)"` exits 0.
3. `node -e "const p=require('@atlure/tailwind-preset'); if(!p.content.some(g=>g.includes('@atlure/ui'))) process.exit(1)"` exits 0.
4. In a scratch project with only `presets: [require("@atlure/tailwind-preset")]`, `npx tailwindcss -i in.css -o out.css` produces a `--primary` custom property and a `.bg-primary` rule; `grep -c "bg-primary" out.css` is at least 1.

## Blocked by

- 013 Scaffold the atlure-ui pnpm workspace with pinned dependencies
- 015 Token parity test suite across all six generated artifacts
