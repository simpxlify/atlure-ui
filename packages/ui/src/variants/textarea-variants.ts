import { cva, type VariantProps } from "class-variance-authority";

export const textareaVariants = cva("", {
  variants: {
    rows: {
      2: "min-h-16",
      3: "min-h-24",
      4: "min-h-28",
      6: "min-h-40",
    },
  },
  defaultVariants: {
    rows: 3,
  },
});

export const textareaCounterClassName = "self-end";

export type TextareaVariantProps = VariantProps<typeof textareaVariants>;
export type TextareaRows = NonNullable<TextareaVariantProps["rows"]>;
