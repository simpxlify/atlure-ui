---
id: "110"
title: "Performance budgets: Lighthouse CI on web / startup and bundle budgets on app"
repo: all
epic: quality
priority: P2
size: M
serialize: "No"
milestone: M6
blocked_by: "101 SEO infrastructure: sitemap / robots / canonicals / OG images and structured data; 098 Programmatic local landing pages per city and service"
labels: "epic:quality; type:performance"
---

# Performance budgets: Lighthouse CI on web / startup and bundle budgets on app

## Context

The marketing site's whole purpose is ranking, and Core Web Vitals are a ranking input, so a performance regression on a programmatic city page is a business regression. On mobile, the app ships `@atlure/ui` as untranspiled source, which means the consumer bundles it — so bundle size and cold-start time need a watched ceiling rather than an assumption.

## Scope

Web:

- Lighthouse CI in the pipeline against the home page, a city page, a sitter profile, the FAQ and a legal page.
- Budgets: performance and SEO at least 95, accessibility 100, LCP under 2.0 s and CLS under 0.05 on a throttled mobile profile. Fail the build on a breach, do not just report.
- A JavaScript-weight budget per route, since these pages should be almost entirely static.

App:

- A bundle-size budget on the exported release bundle, with the number committed so growth is visible in the diff.
- Cold-start time measured on a real mid-range Android device, with a ceiling and a recorded baseline.
- A check that no development-only dependency reaches the release bundle, and that `@atlure/icons` tree-shakes — the whole lucide set must not ship.
- A list render benchmark on the search results and message list at 500 items, asserting no dropped-frame spike beyond a threshold.

Both:

- Budgets live in committed config, and raising one requires an explicit commit with a reason in the message.

## Out of scope

Optimising anything — this ticket establishes measurement and gates. File follow-up tickets for breaches. Backend load testing.

## Files you own

`lighthouserc.json` and `.github/workflows/perf.yml` in `atlure-web`; `perf/budgets.json`, `perf/**` and `.github/workflows/perf.yml` in `atlure-paw`.

## Files you must NOT touch

Any page or screen source. `next.config.ts`, `metro.config.js` — if a budget cannot be met without a config change, file a follow-up ticket.

## Acceptance criteria

1. `pnpm lhci autorun` in `atlure-web` exits 0 with every asserted budget met on all five routes.
2. Add a 500 KB unused client-side import to a scratch commit and confirm the Lighthouse job fails on the JavaScript-weight budget. Revert.
3. `pnpm perf:bundle` in `atlure-paw` exits 0 against the committed budget, and the measured size is recorded in `perf/budgets.json`.
4. A test asserts the release bundle contains no development-only dependency, by name list.
5. A test asserts the release bundle includes only the icons actually imported: the byte count attributable to lucide is under a committed ceiling, and adding an unused icon import does not increase it.
6. Cold-start time on the named reference Android device is measured, recorded in `perf/budgets.json`, and the CI job fails if a later measurement exceeds it by more than 15 per cent.
7. A list benchmark at 500 items reports no frame taking longer than the committed threshold, on both the results and message lists.
8. `gh run list --workflow perf.yml --limit 1 --json conclusion --jq '.[0].conclusion'` prints `success` in both repos.

## Blocked by

- 098 Programmatic local landing pages per city and service
- 101 SEO infrastructure: sitemap / robots / canonicals / OG images and structured data
