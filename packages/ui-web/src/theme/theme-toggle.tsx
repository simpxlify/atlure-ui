import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { useTheme } from './theme-provider';

export interface ThemeToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'children'> {
  lightLabel?: string;
  darkLabel?: string;
}

export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(function ThemeToggle(
  {
    className,
    lightLabel = 'Switch to light theme',
    darkLabel = 'Switch to dark theme',
    onClick,
    ...props
  },
  ref,
) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const label = isDark ? lightLabel : darkLabel;

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      aria-pressed={isDark}
      className={cn(
        'inline-flex h-control-md w-control-md items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setTheme(isDark ? 'light' : 'dark');
      }}
      {...props}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
        {isDark ? (
          <circle cx="12" cy="12" r="5" fill="currentColor" />
        ) : (
          <path
            d="M20 14A8 8 0 1 1 10 4a7 7 0 0 0 10 10z"
            fill="currentColor"
          />
        )}
      </svg>
    </button>
  );
});
