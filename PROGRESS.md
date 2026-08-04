started
investigated pnpm install exit 1: allowBuilds placeholder for esbuild in pnpm-workspace.yaml; set to true
added changesets config with fixed @atlure/* version group
added scripts/verify-packaging.mjs (publint + attw + pack-manifest snapshot) and pack-manifest.json
proved the snapshot catches a leaked dist/*.stories.d.ts: exit 1
added .github/actions/setup composite action; extended ci.yml with a packaging job
added release.yml (sole publisher), changeset-status.yml, secret-scan.yml
