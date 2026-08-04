import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { withStorybookPage } from './chrome-harness.mjs';

const require = createRequire(import.meta.url);
const axeSource = await readFile(require.resolve('axe-core'), 'utf8');
const blockingImpacts = new Set(['serious', 'critical']);

const runAxe = `(async () => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const report = await window.axe.run('#storybook-root');
      return JSON.stringify(
        report.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          nodes: violation.nodes.length,
        })),
      );
    } catch (error) {
      if (!String(error).includes('already running')) throw error;
      await new Promise((done) => setTimeout(done, 250));
    }
  }
  throw new Error('axe never became idle');
})()`;

const results = await withStorybookPage(async ({ openStory, evaluate, staticRoot }) => {
  const index = JSON.parse(await readFile(join(staticRoot, 'index.json'), 'utf8'));
  const storyIds = Object.values(index.entries)
    .filter((entry) => entry.type === 'story')
    .map((entry) => entry.id);

  const perStory = [];

  for (const storyId of storyIds) {
    for (const theme of ['light', 'dark']) {
      await openStory(storyId, `theme:${theme}`);
      const hasAxe = await evaluate('Boolean(window.axe)');
      if (!hasAxe) await evaluate(axeSource);
      perStory.push({ storyId, theme, violations: JSON.parse(await evaluate(runAxe)) });
    }
  }

  return perStory;
});

for (const { storyId, theme, violations } of results) {
  const summary =
    violations.length === 0
      ? 'clean'
      : violations.map((violation) => `${violation.id}(${violation.impact})`).join(', ');
  console.log(`${storyId} [${theme}]: ${summary}`);
}

const blocking = results.filter(({ violations }) =>
  violations.some((violation) => blockingImpacts.has(violation.impact)),
);

console.log(`\nchecked ${results.length} story renders with axe`);

if (blocking.length > 0) {
  console.error(`FAIL: ${blocking.length} story renders have serious or critical violations`);
  process.exit(1);
}

console.log('PASS: no serious or critical axe violations');
