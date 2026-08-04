import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join } from 'node:path';

import { listTarballContents } from './tarball-contents.mjs';
import { listPublishablePackages, repoRoot, runPnpm } from './workspace-packages.mjs';

const manifestPath = join(repoRoot, 'pack-manifest.json');
const isUpdateRun = process.argv.includes('--update');

const MODULE_EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.json', '.ts', '.mts', '.cts', '.node', '']);
const ATTW_PROFILE = 'esm-only';

function collectExportTargets(target) {
  if (typeof target === 'string') return [target];
  if (Array.isArray(target)) return target.flatMap(collectExportTargets);
  if (target && typeof target === 'object') return Object.values(target).flatMap(collectExportTargets);
  return [];
}

function collectAssetEntrypoints({ exports: exportsField }) {
  if (!exportsField || typeof exportsField !== 'object') return [];

  return Object.entries(exportsField)
    .filter(([subpath]) => subpath.startsWith('.'))
    .filter(([, target]) => {
      const targets = collectExportTargets(target);
      return targets.length > 0 && targets.every((file) => !MODULE_EXTENSIONS.has(extname(file)));
    })
    .map(([subpath]) => subpath);
}

function packToTarball(packageDirectory, destination) {
  runPnpm(['pack', '--pack-destination', destination], { cwd: packageDirectory, captureOutput: true });
  const packed = readdirSync(destination).filter((file) => file.endsWith('.tgz'));
  if (packed.length !== 1) throw new Error(`expected exactly one tarball in ${destination}, found ${packed.length}`);
  return join(destination, packed[0]);
}

function reportDifference(expected, actual) {
  const unexpected = actual.filter((file) => !expected.includes(file));
  const missing = expected.filter((file) => !actual.includes(file));
  const lines = [];
  for (const file of unexpected) lines.push(`    + ${file}`);
  for (const file of missing) lines.push(`    - ${file}`);
  return lines.join('\n');
}

function loadCommittedManifest() {
  try {
    return JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch {
    return {};
  }
}

const committedManifest = loadCommittedManifest();
const packages = listPublishablePackages();
const updatedManifest = {};
const failures = [];

if (packages.length === 0) failures.push('no publishable workspace packages were found');

for (const { name, directory, manifest } of packages) {
  console.log(`\n=== ${name}`);

  const workingDirectory = mkdtempSync(join(tmpdir(), 'atlure-pack-'));
  try {
    const tarballPath = packToTarball(directory, workingDirectory);
    const packedFiles = listTarballContents(tarballPath);
    updatedManifest[name] = packedFiles;

    try {
      runPnpm(['exec', 'publint', '--strict', tarballPath]);
    } catch {
      failures.push(`${name}: publint reported problems`);
    }

    const excludedEntrypoints = collectAssetEntrypoints(manifest);
    const attwArgs = ['exec', 'attw', '--profile', ATTW_PROFILE];
    if (excludedEntrypoints.length > 0) attwArgs.push('--exclude-entrypoints', ...excludedEntrypoints);
    try {
      runPnpm([...attwArgs, '--', tarballPath]);
    } catch {
      failures.push(`${name}: @arethetypeswrong/cli reported problems`);
    }

    if (isUpdateRun) {
      console.log(`  pack manifest recorded (${packedFiles.length} files)`);
      continue;
    }

    const expectedFiles = committedManifest[name];
    if (!expectedFiles) {
      failures.push(`${name}: no entry in pack-manifest.json — run "pnpm verify:packaging:update" and commit the result`);
    } else if (expectedFiles.join('\n') !== packedFiles.join('\n')) {
      failures.push(
        `${name}: tarball contents differ from pack-manifest.json\n${reportDifference(expectedFiles, packedFiles)}`,
      );
    } else {
      console.log(`  pack manifest matches (${packedFiles.length} files)`);
    }
  } finally {
    rmSync(workingDirectory, { recursive: true, force: true });
  }
}

if (isUpdateRun) {
  writeFileSync(manifestPath, `${JSON.stringify(updatedManifest, null, 2)}\n`);
  console.log(`\nwrote ${manifestPath}`);
}

const removedPackages = Object.keys(committedManifest).filter((name) => !(name in updatedManifest));
if (!isUpdateRun && removedPackages.length > 0) {
  failures.push(`pack-manifest.json has stale entries for: ${removedPackages.join(', ')}`);
}

if (failures.length > 0) {
  console.error(`\npackaging verification failed:\n${failures.map((failure) => `  - ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log('\npackaging verification passed');
