---
id: "095"
title: Scaffold atlure-web with Next 16 / the DS packages and the theme script
repo: atlure-web
epic: web-marketing
priority: P1
size: M
serialize: "Yes"
milestone: M4
blocked_by: "002 Create and clone the four atlure repos; 045 Web ThemeProvider / dark mode and web feedback states; 012 Create the Vercel project and wire www.atlure.com"
labels: "epic:web-marketing; type:scaffold; serialize"
---

# Scaffold atlure-web with Next 16 / the DS packages and the theme script

## Context

`atlure-web` is **marketing and SEO only** — no product screens, ever. Its job is programmatic local landing pages, indexable sitter profiles, core marketing and legal pages. It consumes `@atlure/ui-web`, `@atlure/tokens` and `@atlure/tailwind-preset` from npm like any third party, which is also the proof that the published packages work outside the design-system repo.

## Scope

- Next 16.3.0, App Router, TypeScript strict, React Server Components by default.
- Tailwind 3.4.19 configured with `presets: [require("@atlure/tailwind-preset")]` and nothing else. Import the tokens' generated web CSS once in the root layout.
- Root layout injecting the blocking theme script from `@atlure/ui-web` so there is no light flash before hydration.
- Site shell: header with navigation and a theme toggle, footer with legal links, and a skip link to main content.
- `NEXT_PUBLIC_SITE_URL` read from env and used for every canonical, sitemap and OG URL — never a hard-coded domain.
- A Supabase browser and server client using the **anon key only**, for the public-read policies. The service-role key must never reach this repo.
- `AGENTS.md`: this repo renders marketing pages only; no product UI, no authenticated flows, no service-role key; components come from `@atlure/ui-web`, never from `@atlure/ui`.
- CI: typecheck, lint, `next build`, and a check that `@atlure/ui` (the native package) is not a dependency.
- `.gitignore` and `.env.example` per ticket 003.

## Out of scope

Any page beyond a placeholder home (tickets 096-103). SEO metadata infrastructure (ticket 101). Analytics (ticket 104).

## Files you own

`package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.js`, `app/layout.tsx`, `app/page.tsx` as a placeholder, `src/components/site-header.tsx`, `site-footer.tsx`, `src/lib/supabase.ts`, `src/lib/site.ts`, `AGENTS.md`, `.github/workflows/ci.yml`.

## Files you must NOT touch

Anything in the other three repos. Do not add `react-native` or `@atlure/ui` as a dependency.

## Acceptance criteria

1. `pnpm build` (`next build`) exits 0 and `pnpm typecheck` exits 0.
2. `node -e "const p=require('./package.json'); if(p.dependencies['@atlure/ui']||p.dependencies['react-native']) process.exit(1)"` exits 0.
3. `grep -n "colors" tailwind.config.js` prints nothing — colours come only from the preset.
4. `grep -rn "atlure.com" app src --include=*.tsx --include=*.ts` finds the domain only inside `src/lib/site.ts`, which reads it from env.
5. `grep -rn "SERVICE_ROLE" .` prints nothing.
6. A Playwright test with `prefers-color-scheme: dark` asserts the first painted background is the dark token colour, proving the blocking script runs before hydration.
7. A Playwright test asserts the skip link is the first focusable element and moves focus to `main`.
8. The built CSS contains a `.bg-primary` rule sourced from the preset: `grep -rc "bg-primary" .next/static/css/*.css` is at least 1.

## Blocked by

- 002 Create and clone the four atlure repos
- 012 Create the Vercel project and wire www.atlure.com
- 045 Web ThemeProvider / dark mode and web feedback states
