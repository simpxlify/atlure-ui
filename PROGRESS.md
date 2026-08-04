started
investigated pnpm install exit 1: allowBuilds placeholder for esbuild in pnpm-workspace.yaml; set to true
added changesets config with fixed @atlure/* version group
added scripts/verify-packaging.mjs (publint + attw + pack-manifest snapshot) and pack-manifest.json
proved the snapshot catches a leaked dist/*.stories.d.ts: exit 1
added .github/actions/setup composite action; extended ci.yml with a packaging job
added release.yml (sole publisher), changeset-status.yml, secret-scan.yml
proved changeset gate: committed packages/ change with no changeset exits 1
proved fixed group: bumping @atlure/types minor moved all three packages to 0.2.0
added RELEASING.md; all local gates green (typecheck, test, build, git diff, verify:packaging)
fixed gitleaks: needed pull-requests read to list PR commits
fixed pre-existing red main: @atlure/types test imports dist, so build must run before test
