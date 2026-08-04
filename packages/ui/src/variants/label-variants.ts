import { cva, type VariantProps } from "class-variance-authority";

export const labelVariants = cva("text-sm font-medium text-foreground", {
  variants: {
    isDisabled: {
      true: "opacity-50",
      false: "",
    },
    isInvalid: {
      true: "text-destructive",
      false: "",
    },
  },
  defaultVariants: {
    isDisabled: false,
    isInvalid: false,
  },
});

export type LabelVariantProps = VariantProps<typeof labelVariants>;
