import { cva, type VariantProps } from "class-variance-authority";

export const progressTrackVariants = cva("w-full overflow-hidden rounded-full bg-muted", {
  variants: {
    size: {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const progressFillClassName = "h-full rounded-full bg-primary";

export type ProgressVariantProps = VariantProps<typeof progressTrackVariants>;
