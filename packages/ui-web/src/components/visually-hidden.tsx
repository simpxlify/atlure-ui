import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { visuallyHiddenClassName } from '../variants';

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden({ className, ...props }, ref) {
    return <span ref={ref} className={cn(visuallyHiddenClassName, className)} {...props} />;
  },
);
