import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import {
  cardContentClassName,
  cardDescriptionClassName,
  cardFooterClassName,
  cardHeaderClassName,
  cardTitleClassName,
  cardVariants,
  type CardVariantProps,
} from '../variants';

export interface CardProps extends HTMLAttributes<HTMLDivElement>, CardVariantProps {}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant, padding, isPressable, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, isPressable }), className)}
      {...props}
    />
  );
});

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cn(cardHeaderClassName, className)} {...props} />;
  },
);

export type CardTitleHeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
  as?: CardTitleHeadingLevel;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { className, asChild = false, as = 'h3', ...props },
  ref,
) {
  const Component = asChild ? Slot : as;
  return <Component ref={ref} className={cn(cardTitleClassName, className)} {...props} />;
});

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cn(cardDescriptionClassName, className)} {...props} />;
  },
);

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn(cardContentClassName, className)} {...props} />;
  },
);

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...props }, ref) {
    return <div ref={ref} className={cn(cardFooterClassName, className)} {...props} />;
  },
);
