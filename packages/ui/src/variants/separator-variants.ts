import { cva, type VariantProps } from "class-variance-authority";

export const separatorVariants = cva("bg-border/20", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "w-px self-stretch",
    },
    spacing: {
      none: "",
      sm: "my-sm",
      md: "my-md",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    spacing: "none",
  },
});

export type SeparatorVariantProps = VariantProps<typeof separatorVariants>;
