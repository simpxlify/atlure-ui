import { cva, type VariantProps } from "class-variance-authority";

export const radioGroupIndicatorSize = 24;

export const radioGroupVariants = cva("flex-col gap-sm", {
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

export const radioGroupItemVariants = cva("flex-row items-center gap-sm", {
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

export const radioGroupIndicatorVariants = cva(
  "h-6 w-6 items-center justify-center rounded-full border-2",
  {
    variants: {
      isSelected: {
        true: "border-primary",
        false: "border-border/20 bg-input-background",
      },
    },
    defaultVariants: {
      isSelected: false,
    },
  },
);

export const radioGroupDotClassName = "h-3 w-3 rounded-full bg-primary";

export type RadioGroupVariantProps = VariantProps<typeof radioGroupVariants>;
export type RadioGroupItemVariantProps = VariantProps<typeof radioGroupItemVariants>;
export type RadioGroupIndicatorVariantProps = VariantProps<typeof radioGroupIndicatorVariants>;
