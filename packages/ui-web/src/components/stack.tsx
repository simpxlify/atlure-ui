import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { stackVariants, type StackVariantProps } from '../variants';

export interface StackProps extends HTMLAttributes<HTMLDivElement>, StackVariantProps {
  asChild?: boolean;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { className, direction, gap, align, justify, shouldWrap, asChild = false, ...props },
  ref,
) {
  const Component = asChild ? Slot : 'div';
  return (
    <Component
      ref={ref}
      className={cn(stackVariants({ direction, gap, align, justify, shouldWrap }), className)}
      {...props}
    />
  );
});

export type RowProps = Omit<StackProps, 'direction'>;

export const Row = forwardRef<HTMLDivElement, RowProps>(function Row(props, ref) {
  return <Stack ref={ref} direction="row" {...props} />;
});
