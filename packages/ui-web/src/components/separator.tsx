import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const Separator = forwardRef<HTMLHRElement, SeparatorProps>(function Separator(
  { className, orientation = 'horizontal', ...props },
  ref,
) {
  return (
    <hr
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'shrink-0 border-0 bg-border',
        orientation === 'horizontal' ? 'my-md h-px w-full' : 'mx-md h-full w-px',
        className,
      )}
      {...props}
    />
  );
});
