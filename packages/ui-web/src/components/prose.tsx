import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { proseClassName } from '../variants';

export type ProseElement = 'div' | 'article' | 'section' | 'main';

export interface ProseProps extends HTMLAttributes<HTMLElement> {
  as?: ProseElement;
}

export const Prose = forwardRef<HTMLElement, ProseProps>(function Prose(
  { className, as = 'div', ...props },
  ref,
) {
  const Component = as;
  return (
    <Component ref={ref as never} className={cn(proseClassName, className)} {...props} />
  );
});
