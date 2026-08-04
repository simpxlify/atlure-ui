---
id: "006"
title: npm deprecate @simpxlify/pawlii-ui pointing at @atlure/ui
repo: admin
epic: decommission
priority: P2
size: XS
serialize: "No"
milestone: M2
blocked_by: "018 Scaffold @atlure/ui as a source-shipping package"
labels: "epic:decommission; type:hygiene; area:npm"
---

# npm deprecate @simpxlify/pawlii-ui pointing at @atlure/ui

## Context

`@simpxlify/pawlii-ui` is public on npm at `0.0.40` after 28 publishes in 16 days. It is far older than 72 hours so it cannot be unpublished. It is also broken: its `exports` map points at `output/module/components/index.js`, which does not exist, and only the legacy `main` stub makes it importable. Deprecating it redirects anyone who finds it to the replacement.

## Scope

Run once, which marks every published version:

```
npm deprecate @simpxlify/pawlii-ui "Renamed. Use @atlure/ui instead: https://www.npmjs.com/package/@atlure/ui"
```

## Out of scope

`npm unpublish` (impossible past 72h and undesirable). Transferring the package into the `@atlure` scope. Publishing any new `@simpxlify/*` version.

## Files you own

None — this is a registry operation.

## Files you must NOT touch

The `pawlii-ui` repo source.

## Acceptance criteria

1. `npm view @simpxlify/pawlii-ui deprecated` prints a string containing `@atlure/ui`.
2. `npm view @atlure/ui version` resolves, proving the package named in the deprecation message exists.

## Blocked by

- 018 Scaffold @atlure/ui as a source-shipping package
