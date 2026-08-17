import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { gridVariants, type GridVariantProps } from '../variants';

export type GridBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type GridColsSpec = number | Partial<Record<GridBreakpoint, number>>;

export interface GridProps extends HTMLAttributes<HTMLDivElement>, GridVariantProps {
  cols?: GridColsSpec;
}

const COLS_CLASS_MAP: Record<GridBreakpoint, (count: number) => string> = {
  base: (count) => `grid-cols-${count}`,
  sm: (count) => `sm:grid-cols-${count}`,
  md: (count) => `md:grid-cols-${count}`,
  lg: (count) => `lg:grid-cols-${count}`,
  xl: (count) => `xl:grid-cols-${count}`,
  '2xl': (count) => `2xl:grid-cols-${count}`,
};

export function colsToClassNames(cols: GridColsSpec | undefined): string {
  if (cols == null) return '';
  if (typeof cols === 'number') return COLS_CLASS_MAP.base(cols);
  const entries = Object.entries(cols) as Array<[GridBreakpoint, number]>;
  return entries
    .filter(([, count]) => Number.isFinite(count) && count > 0)
    .map(([breakpoint, count]) => COLS_CLASS_MAP[breakpoint](count))
    .join(' ');
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { className, gap, cols, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(gridVariants({ gap }), colsToClassNames(cols), className)}
      {...props}
    />
  );
});
