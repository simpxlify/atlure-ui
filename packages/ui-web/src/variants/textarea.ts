import { cva, type VariantProps } from 'class-variance-authority';

export const textareaVariants = cva('', {
  variants: {
    rows: {
      2: 'min-h-textarea-sm',
      3: 'min-h-textarea-md',
      4: 'min-h-textarea-lg',
      6: 'min-h-textarea-xl',
    },
  },
  defaultVariants: {
    rows: 3,
  },
});

export const textareaCounterClassName = 'self-end';

export type TextareaVariantProps = VariantProps<typeof textareaVariants>;
export type TextareaRows = NonNullable<TextareaVariantProps['rows']>;
