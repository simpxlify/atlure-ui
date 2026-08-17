import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export type SkeletonShape = 'line' | 'title' | 'block' | 'circle';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  shape?: SkeletonShape;
}

const SHAPE_CLASSNAMES: Record<SkeletonShape, string> = {
  line: 'h-4 w-full rounded-sm',
  title: 'h-6 w-2/3 rounded-sm',
  block: 'h-24 w-full rounded-lg',
  circle: 'h-10 w-10 rounded-full',
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, shape = 'line', ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn('animate-pulse bg-muted', SHAPE_CLASSNAMES[shape], className)}
      {...props}
    />
  );
});
