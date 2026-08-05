import { cva, type VariantProps } from "class-variance-authority";

export const starRatingIconSize = {
  sm: 12,
  md: 16,
  lg: 24,
} as const;

export type StarRatingSize = keyof typeof starRatingIconSize;

export const starRatingClassName = "flex-row items-center gap-xs";
export const starRatingFilledClassName = "text-warning";
export const starRatingEmptyClassName = "text-muted-foreground";

export const starRatingValueVariants = cva("font-medium text-muted-foreground", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type StarRatingValueVariantProps = VariantProps<typeof starRatingValueVariants>;
