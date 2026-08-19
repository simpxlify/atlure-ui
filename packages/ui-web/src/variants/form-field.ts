import { cva, type VariantProps } from 'class-variance-authority';

export const formFieldClassName = 'flex w-full flex-col gap-xs';

export const formFieldMessageVariants = cva('text-xs', {
  variants: {
    isInvalid: {
      true: 'text-destructive',
      false: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    isInvalid: false,
  },
});

export type FormFieldMessageVariantProps = VariantProps<typeof formFieldMessageVariants>;
