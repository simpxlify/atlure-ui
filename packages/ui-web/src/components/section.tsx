import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { sectionVariants, type SectionVariantProps } from '../variants';

export type SectionElement = 'section' | 'article' | 'aside' | 'footer' | 'header' | 'main' | 'div';

export interface SectionProps extends HTMLAttributes<HTMLElement>, SectionVariantProps {
  as?: SectionElement;
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { className, tone, as = 'section', ...props },
  ref,
) {
  const Component = as;
  return (
    <Component
      ref={ref as never}
      className={cn(sectionVariants({ tone }), className)}
      {...props}
    />
  );
});
