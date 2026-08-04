import { Slot, Slottable } from '@radix-ui/react-slot';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { buttonVariants, type ButtonVariantProps } from '../variants';
import { Spinner } from './spinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantProps {
  asChild?: boolean;
  isLoading?: boolean;
  loadingLabel?: string;
  startSlot?: ReactNode;
  endSlot?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    isFullWidth,
    asChild = false,
    isLoading = false,
    loadingLabel,
    startSlot,
    endSlot,
    disabled = false,
    children,
    ...props
  },
  ref,
) {
  const Component = asChild ? Slot : 'button';
  const isDisabled = disabled || isLoading;
  const disabledProps = asChild ? {} : { disabled: isDisabled };

  return (
    <Component
      ref={ref}
      className={cn(buttonVariants({ variant, size, isFullWidth }), className)}
      aria-disabled={isDisabled || undefined}
      aria-busy={isLoading || undefined}
      {...disabledProps}
      {...props}
    >
      {isLoading ? <Spinner /> : startSlot}
      <Slottable>{children}</Slottable>
      {isLoading && loadingLabel && <span className="sr-only">{loadingLabel}</span>}
      {!isLoading && endSlot}
    </Component>
  );
});
