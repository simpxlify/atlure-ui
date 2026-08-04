import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { containerVariants, type ContainerVariantProps } from '../variants';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement>, ContainerVariantProps {
  asChild?: boolean;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { className, width, asChild = false, ...props },
  ref,
) {
  const Component = asChild ? Slot : 'div';
  return (
    <Component ref={ref} className={cn(containerVariants({ width }), className)} {...props} />
  );
});
