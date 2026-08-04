# Changesets

Every change under `packages/` needs a changeset. Run `pnpm changeset`, pick the affected
packages, pick the bump, and commit the generated markdown file alongside your code.

All `@atlure/*` packages are a **fixed** version group: they always publish the same version
number together, so "which `@atlure/tokens` does `@atlure/ui` 0.4 need" is never a question.
A bump to one bumps all of them.

Apps and any other private workspace project are excluded — `privatePackages.version` is
`false`, so nothing without `"private": false` semantics is ever versioned or tagged.

Publishing happens **only** from `.github/workflows/release.yml`. See `RELEASING.md`.
