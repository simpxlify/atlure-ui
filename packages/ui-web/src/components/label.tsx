import * as LabelPrimitive from '@radix-ui/react-label';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { cn } from '../lib/cn';
import {
  labelRequiredMarkerClassName,
  labelVariants,
} from '../variants';

type RadixLabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;

export interface LabelProps extends RadixLabelProps {
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
}

export const Label = forwardRef<ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  function Label(
    { className, isDisabled = false, isInvalid = false, isRequired = false, children, ...props },
    ref,
  ) {
    return (
      <LabelPrimitive.Root
        ref={ref}
        className={cn(labelVariants({ isDisabled, isInvalid }), className)}
        {...props}
      >
        {children}
        {isRequired ? <span aria-hidden className={labelRequiredMarkerClassName}>{' *'}</span> : null}
      </LabelPrimitive.Root>
    );
  },
);
