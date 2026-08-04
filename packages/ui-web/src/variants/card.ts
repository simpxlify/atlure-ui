import { cva, type VariantProps } from 'class-variance-authority';

export const cardVariants = cva('flex flex-col rounded-lg bg-card text-card-foreground', {
  variants: {
    variant: {
      elevated: 'border border-border/20 shadow-sm',
      outlined: 'border border-border',
      flat: 'border-0',
    },
    padding: {
      none: 'p-0',
      sm: 'p-md',
      md: 'p-lg',
      lg: 'p-xl',
    },
    isInteractive: {
      true: 'transition-colors hover:bg-accent/10',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'elevated',
    padding: 'md',
    isInteractive: false,
  },
});

export const cardHeaderClassName = 'flex flex-col gap-xs';

export const cardTitleClassName = 'text-lg font-semibold text-card-foreground';

export const cardDescriptionClassName = 'text-sm text-muted-foreground';

export const cardContentClassName = 'flex flex-col gap-sm';

export const cardFooterClassName = 'flex flex-row items-center gap-sm';

export type CardVariantProps = VariantProps<typeof cardVariants>;
