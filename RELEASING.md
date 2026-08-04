# Releasing

Publishing happens in exactly one place: `.github/workflows/release.yml`. Nothing is ever
published from a laptop. The predecessor package shipped 28 versions in 16 days from a laptop,
with gaps where `npm version` bumped and the publish then failed, and the guardrails below all
exist to make specific defects from that package impossible to repeat.

---

## Before the first publish — action required from the user

Two things do not exist yet and cannot be created by CI:

1. **The `@atlure` npm organisation.** It has not been created. Go to
   <https://www.npmjs.com/org/create>, create the org as `atlure`, and pick the free plan
   (public packages only, which is what these are — every package sets
   `publishConfig.access: "public"`). Until this exists, `changeset publish` fails with a 404
   on the very first package.

2. **An npm granular access token scoped to `@atlure`.** From
   <https://www.npmjs.com/settings/~/tokens> create a **Granular Access Token** with:
   - *Packages and scopes*: **Read and write**, limited to the `@atlure` scope only — never
     "All packages".
   - *Organizations*: no permission needed.
   - An expiry you will actually renew (90 days is a reasonable default).
   - No IP allowlist, since GitHub-hosted runners have no stable egress address.

   Add it to the repository as the secret **`NPM_TOKEN`**
   (*Settings → Secrets and variables → Actions → New repository secret*).

Also confirm, once, under *Settings → Actions → General*:
- **Workflow permissions**: read and write.
- **Allow GitHub Actions to create and approve pull requests**: enabled. Without this,
  `changesets/action` cannot open the version PR.

---

## The flow

1. **You open a PR.** Any change under `packages/` needs a changeset:

   ```bash
   pnpm changeset
   ```

   Pick the packages, pick the bump, write the line that will appear in the changelog. Commit
   the generated file in `.changeset/`. For a change under `packages/` that genuinely needs no
   release — a test-only change, for instance — use `pnpm changeset --empty`.

   `changeset-status.yml` fails the PR if you skip this.

2. **The PR merges to `main`.** `release.yml` runs, typechecks, tests, builds, verifies
   packaging, and then `changesets/action` opens (or updates) a PR titled
   *"chore(release): version @atlure packages"*. That PR consumes the changeset files, bumps
   every version and writes the `CHANGELOG.md` files. Nothing is published yet.

3. **You merge the version PR.** `release.yml` runs again, sees no changesets left, and runs
   `pnpm release` — which builds and then `changeset publish`. That publishes to npm with
   provenance, pushes the git tags, and creates the GitHub releases from the changelog entries.

There is no step where a human types `npm publish`.

---

## One version number for everything

`.changeset/config.json` puts all `@atlure/*` packages in a **`fixed`** group:

```json
"fixed": [["@atlure/*"]]
```

A bump to any one of them bumps all of them to the same number. `@atlure/ui@0.4.0` therefore
always pairs with `@atlure/tokens@0.4.0`, and "which tokens version does this ui version need"
stops being a question anyone has to answer. The cost is empty changelog entries in packages
that did not actually change; that is a deliberate trade.

The glob covers packages that do not exist yet, so `@atlure/ui` and `@atlure/ui-web` join the
group automatically the moment they land — no list to keep in sync.

### Apps and private packages

They are excluded by `privatePackages: { "version": false, "tag": false }`, not by name. Any
workspace project with `"private": true` is never versioned, never tagged and never published.

**This is why `ignore` is empty.** Changesets validates `ignore` against the packages that
actually exist and hard-errors on an entry it cannot resolve, so pre-listing future app names
there would break every changesets command until those apps were created. Marking apps
`"private": true` — which they must be anyway — is the mechanism that scales.

---

## Packaging verification

This is the part that catches real defects. `pnpm verify:packaging` runs in `ci.yml` on every
PR and again in `release.yml` before publishing. It iterates the workspace via
`pnpm -r list --depth -1 --json` and treats every non-private project as publishable, so new
packages are covered the day they appear without anyone editing CI.

For each package it packs a real tarball with `pnpm pack` and then runs three checks:

| Check | What it would have caught |
|---|---|
| `publint --strict` | an `exports` target that does not exist in the tarball — the `@simpxlify/pawlii-ui@0.0.40` bug, where `exports` pointed at `output/module/components/index.js` and only worked by accident via a legacy `main` stub |
| `attw` (`@arethetypeswrong/cli`) | a missing top-level `types`, types that resolve differently from runtime, wrong module format |
| pack-manifest snapshot | compiled `.stories.js`, `.storybook/*.d.ts` and the demo app's screen `.d.ts` shipping inside the tarball |

### The pack-manifest snapshot

`pack-manifest.json` at the repo root records the exact, sorted file list of every publishable
tarball. `scripts/verify-packaging.mjs` packs each package and diffs the result against it. A
tarball that gains *or* loses a file fails the build, printing the difference:

```
@atlure/types: tarball contents differ from pack-manifest.json
    + dist/home-screen.stories.d.ts
```

When a change to a package's `files` field or build output is intentional:

```bash
pnpm -r build
pnpm verify:packaging:update
```

and commit the updated `pack-manifest.json`. Reviewing that diff is the point — an unexplained
`+` line in it is the leak, caught before publish rather than after.

### Two deliberate settings in the verification script

**`attw --profile esm-only`.** These packages are `"type": "module"` with an `import`-only
`exports` map, so `require("@atlure/tokens")` resolves to ESM. Under attw's default `strict`
profile that is an error. It is not a mistake here: the packages are intentionally ESM-only and
Atlure's consumers are ESM. The `esm-only` profile ignores the `node10` and `node16-cjs`
resolution modes for exactly this case while still checking everything else. Supporting CJS
consumers would mean shipping a second build; the day that is wanted, drop the profile flag and
let attw drive the work.

**Asset entrypoints are excluded from attw.** `@atlure/tokens` exports `./theme.css`,
`./native.css` and `./theme.v4.css`. attw treats every `exports` subpath as a typed entrypoint
and reports "resolution failed" for stylesheets. The script derives the exclusion list from the
`exports` map — any subpath whose targets are all non-module file extensions — rather than
hardcoding names, so future asset exports are handled automatically.

**`@arethetypeswrong/cli` must stay at `>= 0.18.5`.** Versions `0.16.4` through `0.18.4`
cannot read a tarball at all: `extractTarball` keeps only the final chunk from fflate's
streaming `Gunzip`, and this repo's tarballs produce a trailing empty chunk, so every run dies
with `Cannot read properties of undefined (reading 'filename')`. Do not downgrade it.

---

## Secret scanning

`secret-scan.yml` runs `gitleaks` over the full history on every PR and on `main`. It is free
for personal accounts and public repositories. If `simpxlify` ever becomes a GitHub
*organisation*, gitleaks-action starts requiring a `GITLEAKS_LICENSE` secret and the job will
fail until one is added.

---

## The `esbuild` install exit code

`pnpm install` used to exit `1` with `[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts:
esbuild@0.25.12`, which would have failed every CI run at the install step.

The cause was `pnpm-workspace.yaml`, which carried a literal placeholder:

```yaml
allowBuilds:
  esbuild: set this to true or false
```

pnpm 11 treats a non-boolean value there as an undecided dependency, ignores its build script
and exits non-zero. It is a prompt for a decision, not a bug.

The decision taken is `esbuild: true`. `esbuild` arrives via
`tailwindcss → postcss-load-config → tsx` and its postinstall only links the platform binary.
Nothing in the repo executes it today, so `false` would also make install exit `0` — but
`@atlure/ui` and `@atlure/ui-web` use Vitest, which needs that binary, so `false` would break
them the moment they land. The install was re-run afterwards to confirm `pnpm-lock.yaml` is
unchanged, so `ci.yml`'s `git diff --exit-code` stays clean.

Note that `@atlure/tokens` still deliberately avoids `esbuild`, `tsx` and Vitest entirely and
uses Node's built-in test runner. Allowing the build script does not change that.

---

## Workflows

| File | Runs on | Does |
|---|---|---|
| `ci.yml` | PRs, `main` | `verify`: typecheck, build, test, `git diff --exit-code`. `packaging`: build, then `pnpm verify:packaging` |
| `changeset-status.yml` | PRs into `main` | fails a PR that changes a package without a changeset. Skipped on the `changeset-release/main` branch, which deletes changesets by design |
| `secret-scan.yml` | PRs, `main` | gitleaks over full history |
| `release.yml` | push to `main` | the only publisher: version PR, npm publish with provenance, git tags, GitHub releases |

**Build runs before test.** `@atlure/types`' test imports `dist/index.js`, so on a clean
checkout the previous `test` → `build` ordering failed with `ERR_MODULE_NOT_FOUND` — this was
already red on `main` and had nothing to do with the release work. Swapping the two steps fixes
it here. The cleaner fix belongs to that package: `@atlure/tokens`' test script builds what it
needs first (`pnpm run generate && node --test ...`) and `@atlure/types`' should do the same, at
which point CI stops depending on step order at all.

They share `.github/actions/setup`, which installs pnpm from the `packageManager` field, Node
from `.nvmrc`, and runs `pnpm install --frozen-lockfile`. Pinning pnpm in one place means the
version cannot drift between workflows.

`release.yml` needs `id-token: write` for npm provenance, `contents: write` to push the version
commit and tags, and `pull-requests: write` to open the version PR. `NPM_CONFIG_PROVENANCE` is
what turns provenance on — `changeset publish` shells out to `pnpm publish`, which reads it
from the environment. Provenance also requires each package's `repository` field to point at
this repo, which all three do.

---

## What is deliberately absent

- **No `scripts/switch-main.js`.** The predecessor rewrote its own `package.json` at publish
  time to swap the `main` field. Every package here declares the `exports` map it actually
  ships and the packaging checks verify the targets exist.
- **No `npm version`.** Versions are computed by `changeset version` from the changeset files.
- **No publish step a human can run.** `pnpm release` exists as an npm script, but it is only
  ever invoked by `release.yml`; running it locally would fail on the missing `NPM_TOKEN`, and
  doing so anyway is the thing this document exists to prevent.
