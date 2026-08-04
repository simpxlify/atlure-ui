import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { cn } from '../lib/cn';
import {
  accordionContentClassName,
  accordionItemClassName,
  accordionTriggerClassName,
  accordionVariants,
  type AccordionVariantProps,
} from '../variants';
import { ChevronDown } from './chevron-down';

export type AccordionProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> &
  AccordionVariantProps;

export const Accordion = forwardRef<ElementRef<typeof AccordionPrimitive.Root>, AccordionProps>(
  function Accordion({ className, variant, ...props }, ref) {
    return (
      <AccordionPrimitive.Root
        ref={ref}
        className={cn(accordionVariants({ variant }), className)}
        {...props}
      />
    );
  },
);

export const AccordionItem = forwardRef<
  ElementRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(function AccordionItem({ className, ...props }, ref) {
  return (
    <AccordionPrimitive.Item ref={ref} className={cn(accordionItemClassName, className)} {...props} />
  );
});

export const AccordionTrigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(accordionTriggerClassName, 'flex-1', className)}
        {...props}
      >
        {children}
        <ChevronDown className="shrink-0 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

export const AccordionContent = forwardRef<
  ElementRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(function AccordionContent({ className, ...props }, ref) {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(accordionContentClassName, className)}
      {...props}
    />
  );
});
