import { cva, type VariantProps } from 'class-variance-authority';

export const inputVariants = cva(
  'w-full flex-row rounded-md border bg-input-background text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-control-sm px-sm',
        md: 'h-control-md px-md',
        lg: 'h-control-lg px-md',
      },
      isInvalid: {
        true: 'border-destructive focus-visible:ring-destructive',
        false: 'border-input focus-visible:ring-ring',
      },
    },
    defaultVariants: {
      size: 'md',
      isInvalid: false,
    },
  },
);

export const inputLabelClassName = 'text-sm font-medium text-foreground';

export const inputHintClassName = 'text-xs text-muted-foreground';

export const inputErrorClassName = 'text-xs font-medium text-destructive';

export type InputVariantProps = VariantProps<typeof inputVariants>;
