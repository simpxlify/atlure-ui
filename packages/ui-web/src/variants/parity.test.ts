import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const webVariantsDir = here;
const nativeVariantsDir = resolve(here, '..', '..', '..', 'ui', 'src', 'variants');

function sliceBalanced(source: string, openIndex: number): string {
  let depth = 0;
  for (let index = openIndex; index < source.length; index += 1) {
    const character = source[index];
    if (character === '{') depth += 1;
    if (character === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(openIndex + 1, index);
    }
  }
  throw new Error('unbalanced braces while parsing a variants block');
}

function topLevelKeys(block: string): string[] {
  const keys: string[] = [];
  let depth = 0;
  let index = 0;

  while (index < block.length) {
    const character = block[index];

    if (character === "'" || character === '"' || character === '`') {
      index += 1;
      while (index < block.length && block[index] !== character) {
        if (block[index] === '\\') index += 1;
        index += 1;
      }
      index += 1;
      continue;
    }

    if (character === '{' || character === '[' || character === '(') {
      depth += 1;
    } else if (character === '}' || character === ']' || character === ')') {
      depth -= 1;
    } else if (depth === 0) {
      const match = /^([A-Za-z_$][\w$]*)\s*:/.exec(block.slice(index));
      const captured = match?.[1];
      if (match && captured !== undefined) {
        keys.push(captured);
        index += match[0].length;
        continue;
      }
    }

    index += 1;
  }

  return keys;
}

function readAxes(file: string): Record<string, string[]> {
  const source = readFileSync(file, 'utf8');
  const marker = source.indexOf('variants:');
  if (marker === -1) return {};
  const open = source.indexOf('{', marker);
  const block = sliceBalanced(source, open);

  const axes: Record<string, string[]> = {};
  for (const axis of topLevelKeys(block)) {
    const axisMarker = block.indexOf(`${axis}:`);
    const axisOpen = block.indexOf('{', axisMarker);
    axes[axis] = topLevelKeys(sliceBalanced(block, axisOpen)).sort();
  }
  return axes;
}

const PAIRS = [
  { name: 'button', web: 'button.ts', native: 'button-variants.ts' },
  { name: 'badge', web: 'badge.ts', native: 'badge-variants.ts' },
  { name: 'card', web: 'card.ts', native: 'card-variants.ts' },
  { name: 'input', web: 'input.ts', native: 'input-variants.ts' },
] as const;

const PLATFORM_ONLY_AXES: Record<string, { webOnly: string[]; nativeOnly: string[] }> = {
  button: { webOnly: [], nativeOnly: ['isDisabled'] },
  badge: { webOnly: [], nativeOnly: ['size'] },
  card: { webOnly: ['padding'], nativeOnly: [] },
  input: { webOnly: [], nativeOnly: ['isDisabled', 'isMultiline'] },
};

const OPTION_DRIFT_ALLOWED: Record<string, Record<string, { web: string[]; native: string[] }>> = {};

describe('When a component exists on both web and native', () => {
  it('parses a non-empty variant axis set from both platforms', () => {
    for (const { name, web, native } of PAIRS) {
      expect(Object.keys(readAxes(resolve(webVariantsDir, web))).length, `web ${name}`).toBeGreaterThan(0);
      expect(
        Object.keys(readAxes(resolve(nativeVariantsDir, native))).length,
        `native ${name}`,
      ).toBeGreaterThan(0);
    }
  });

  it('exposes identical option names on every axis both platforms share', () => {
    for (const { name, web, native } of PAIRS) {
      const webAxes = readAxes(resolve(webVariantsDir, web));
      const nativeAxes = readAxes(resolve(nativeVariantsDir, native));

      for (const axis of Object.keys(webAxes).filter((candidate) => candidate in nativeAxes)) {
        const allowed = OPTION_DRIFT_ALLOWED[name]?.[axis];
        if (allowed) {
          expect(webAxes[axis], `${name}.${axis} web drifted from its approved list`).toEqual(allowed.web);
          expect(nativeAxes[axis], `${name}.${axis} native drifted from its approved list`).toEqual(
            allowed.native,
          );
          continue;
        }
        expect(webAxes[axis], `${name}.${axis} diverges between platforms`).toEqual(nativeAxes[axis]);
      }
    }
  });

  it('holds platform-only axes to an explicitly approved list', () => {
    const found: Record<string, { webOnly: string[]; nativeOnly: string[] }> = {};
    for (const { name, web, native } of PAIRS) {
      const webAxes = Object.keys(readAxes(resolve(webVariantsDir, web)));
      const nativeAxes = Object.keys(readAxes(resolve(nativeVariantsDir, native)));
      const webOnly = webAxes.filter((axis) => !nativeAxes.includes(axis)).sort();
      const nativeOnly = nativeAxes.filter((axis) => !webAxes.includes(axis)).sort();
      if (webOnly.length > 0 || nativeOnly.length > 0) found[name] = { webOnly, nativeOnly };
    }
    expect(found).toEqual(PLATFORM_ONLY_AXES);
  });
});
