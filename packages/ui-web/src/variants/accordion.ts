import { cva, type VariantProps } from 'class-variance-authority';

export const accordionVariants = cva('flex flex-col', {
  variants: {
    variant: {
      bordered: 'rounded-lg border border-border',
      plain: '',
    },
  },
  defaultVariants: {
    variant: 'bordered',
  },
});

export const accordionItemClassName = 'flex flex-col border-b border-border/20 last:border-b-0';

export const accordionTriggerClassName =
  'flex flex-row items-center justify-between gap-sm px-lg py-md text-left text-base font-medium text-foreground transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset';

export const accordionContentClassName = 'px-lg pb-md text-sm text-muted-foreground';

export type AccordionVariantProps = VariantProps<typeof accordionVariants>;
