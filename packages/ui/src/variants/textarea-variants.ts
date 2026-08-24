import { cva, type VariantProps } from "class-variance-authority";

export const textareaVariants = cva("", {
  variants: {
    rows: {
      2: "min-h-textarea-2",
      3: "min-h-textarea-3",
      4: "min-h-textarea-4",
      6: "min-h-textarea-6",
    },
  },
  defaultVariants: {
    rows: 3,
  },
});

export const textareaCounterClassName = "self-end";

export type TextareaVariantProps = VariantProps<typeof textareaVariants>;
export type TextareaRows = NonNullable<TextareaVariantProps["rows"]>;
