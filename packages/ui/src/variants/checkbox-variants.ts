import { cva, type VariantProps } from "class-variance-authority";

export const checkboxRowVariants = cva("flex-row items-center gap-sm", {
  variants: {
    isDisabled: {
      true: "opacity-50",
      false: "",
    },
  },
  defaultVariants: {
    isDisabled: false,
  },
});

export const checkboxBoxVariants = cva("h-6 w-6 items-center justify-center rounded-sm border-2", {
  variants: {
    isChecked: {
      true: "border-primary bg-primary",
      false: "border-border/20 bg-input-background",
    },
    isInvalid: {
      true: "border-destructive",
      false: "",
    },
  },
  defaultVariants: {
    isChecked: false,
    isInvalid: false,
  },
});

export const checkboxIndicatorVariants = cva("h-3 w-3 rounded-sm", {
  variants: {
    isChecked: {
      true: "bg-primary-foreground",
      false: "bg-transparent",
    },
  },
  defaultVariants: {
    isChecked: false,
  },
});

export type CheckboxRowVariantProps = VariantProps<typeof checkboxRowVariants>;
export type CheckboxBoxVariantProps = VariantProps<typeof checkboxBoxVariants>;
export type CheckboxIndicatorVariantProps = VariantProps<typeof checkboxIndicatorVariants>;
