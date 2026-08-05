import { cva, type VariantProps } from "class-variance-authority";

export const spinnerVariants = cva("self-center", {
  variants: {
    size: {
      sm: "h-control-sm",
      md: "h-control-md",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type SpinnerVariantProps = VariantProps<typeof spinnerVariants>;
