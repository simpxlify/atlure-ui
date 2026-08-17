import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { buttonVariants, type ButtonVariantProps } from '../variants';
import { Spinner } from './spinner';

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'children'>,
    Pick<ButtonVariantProps, 'variant'> {
  icon: ReactNode;
  'aria-label': string;
  isLoading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, variant, icon, isLoading = false, disabled = false, ...props },
  ref,
) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type="button"
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-busy={isLoading || undefined}
      className={cn(buttonVariants({ variant, size: 'icon' }), className)}
      {...props}
    >
      {isLoading ? <Spinner /> : icon}
    </button>
  );
});
