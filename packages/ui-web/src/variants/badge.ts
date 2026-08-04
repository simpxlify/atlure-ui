import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex flex-row items-center gap-xs rounded-full px-sm py-xs text-xs font-medium',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        muted: 'bg-muted text-muted-foreground',
        outline: 'border border-border bg-transparent text-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;
