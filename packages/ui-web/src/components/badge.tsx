import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { badgeVariants, type BadgeVariantProps } from '../variants';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, BadgeVariantProps {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant, ...props },
  ref,
) {
  return <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />;
});
