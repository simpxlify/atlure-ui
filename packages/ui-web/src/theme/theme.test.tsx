import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ThemeProvider, useTheme } from './theme-provider';
import {
  applyStoredTheme,
  readStoredTheme,
  THEME_CLASS,
  THEME_STORAGE_KEY,
} from './theme-script';
import { ThemeToggle } from './theme-toggle';

const here = dirname(fileURLToPath(import.meta.url));
const themeCssPath = resolve(
  here,
  '..',
  '..',
  '..',
  '..',
  'packages',
  'tokens',
  'generated',
  'theme.css',
);

function primaryFor(selector: 'light' | 'dark'): string {
  const source = readFileSync(themeCssPath, 'utf8');
  const marker = selector === 'dark' ? '.dark:root' : ':root';
  const blockStart = source.indexOf(marker);
  if (blockStart === -1) throw new Error(`no ${marker} block in theme.css`);
  const openBrace = source.indexOf('{', blockStart);
  const closeBrace = source.indexOf('}', openBrace);
  const block = source.slice(openBrace, closeBrace);
  const match = /--primary:\s*([^;]+);/.exec(block);
  if (!match || !match[1]) throw new Error('no --primary in block');
  return match[1].trim();
}

function resetDom() {
  document.documentElement.classList.remove(THEME_CLASS);
  document.documentElement.style.colorScheme = '';
  try {
    window.localStorage.clear();
  } catch {}
}

describe('When the inline theme script runs before hydration', () => {
  beforeEach(resetDom);
  afterEach(resetDom);

  it('applies the stored dark preference synchronously', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');

    applyStoredTheme();

    expect(document.documentElement.classList.contains(THEME_CLASS)).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('leaves the dark class off when the stored preference is light', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');

    applyStoredTheme();

    expect(document.documentElement.classList.contains(THEME_CLASS)).toBe(false);
  });
});

describe('When useTheme.setTheme is called', () => {
  beforeEach(resetDom);
  afterEach(resetDom);

  function TestControls() {
    const { theme, setTheme } = useTheme();
    return (
      <div>
        <span data-testid="theme">{theme}</span>
        <button type="button" onClick={() => setTheme('light')}>
          go light
        </button>
        <button type="button" onClick={() => setTheme('dark')}>
          go dark
        </button>
      </div>
    );
  }

  it('removes the dark class, persists the value, and reads it back', async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    applyStoredTheme();
    expect(document.documentElement.classList.contains(THEME_CLASS)).toBe(true);

    render(
      <ThemeProvider>
        <TestControls />
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: /go light/i }));

    expect(document.documentElement.classList.contains(THEME_CLASS)).toBe(false);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(readStoredTheme()).toBe('light');
  });
});

describe('When comparing the light and dark palettes', () => {
  it('keeps --primary identical in both modes — the brand orange never gets lost', () => {
    const light = primaryFor('light');
    const dark = primaryFor('dark');
    expect(dark).toBe(light);
  });
});

describe('When rendering the ThemeToggle', () => {
  beforeEach(resetDom);
  afterEach(resetDom);

  it('exposes an aria-label that reflects the target state and flips after activation', async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
    applyStoredTheme();

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const toggle = screen.getByRole('button', { name: /switch to dark theme/i });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(toggle);

    expect(screen.getByRole('button', { name: /switch to light theme/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
