import { cva, type VariantProps } from "class-variance-authority";

export const checkboxBoxSize = 24;

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
    isSelected: {
      true: "border-primary bg-primary",
      false: "border-border/20 bg-input-background",
    },
    isInvalid: {
      true: "border-destructive",
      false: "",
    },
  },
  defaultVariants: {
    isSelected: false,
    isInvalid: false,
  },
});

export const checkboxIndicatorClassName = "text-primary-foreground";

export type CheckboxRowVariantProps = VariantProps<typeof checkboxRowVariants>;
export type CheckboxBoxVariantProps = VariantProps<typeof checkboxBoxVariants>;
