export const THEME_STORAGE_KEY = 'atlure-theme';
export const THEME_CLASS = 'dark';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export function readStoredTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {}
  return 'system';
}

export function systemTheme(): ResolvedTheme {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? systemTheme() : theme;
}

export function applyThemeClass(resolved: ResolvedTheme): void {
  const root = document.documentElement;
  if (resolved === 'dark') root.classList.add(THEME_CLASS);
  else root.classList.remove(THEME_CLASS);
  root.style.colorScheme = resolved;
}

export function applyStoredTheme(): void {
  applyThemeClass(resolveTheme(readStoredTheme()));
}

export const themeScript = `(function(){try{var s=window.localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});var t=(s==='light'||s==='dark'||s==='system')?s:'system';var r=t==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;var e=document.documentElement;if(r==='dark'){e.classList.add(${JSON.stringify(
  THEME_CLASS,
)});}else{e.classList.remove(${JSON.stringify(
  THEME_CLASS,
)});}e.style.colorScheme=r;}catch(e){}})();`;
