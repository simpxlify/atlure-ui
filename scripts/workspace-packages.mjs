import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = fileURLToPath(new URL('..', import.meta.url));

function resolvePnpmInvocation() {
  const execPath = process.env.npm_execpath;
  if (execPath && /\.[cm]?js$/.test(execPath)) return { command: process.execPath, prefixArgs: [execPath] };
  return { command: process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', prefixArgs: [] };
}

export function runPnpm(args, { cwd = repoRoot, captureOutput = false } = {}) {
  const { command, prefixArgs } = resolvePnpmInvocation();
  return execFileSync(command, [...prefixArgs, ...args], {
    cwd,
    encoding: 'utf8',
    stdio: captureOutput ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  });
}

export function listPublishablePackages() {
  const projects = JSON.parse(runPnpm(['-r', 'list', '--depth', '-1', '--json'], { captureOutput: true }));

  return projects
    .filter((project) => project.private !== true)
    .map((project) => ({
      name: project.name,
      version: project.version,
      directory: project.path,
      manifest: JSON.parse(readFileSync(join(project.path, 'package.json'), 'utf8')),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}
