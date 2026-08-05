import { cva, type VariantProps } from "class-variance-authority";

export const screenHeaderVariants = cva("flex-row bg-background px-md", {
  variants: {
    variant: {
      default: "items-center gap-sm py-sm",
      large: "items-start gap-md py-lg",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const screenHeaderTextClassName = "flex-1 flex-col gap-xs";
export const screenHeaderActionsClassName = "flex-row items-center gap-xs";

export const screenHeaderTitleVariants = cva("", {
  variants: {
    variant: {
      default: "text-lg font-semibold text-foreground",
      large: "text-2xl font-bold text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const screenHeaderSubtitleClassName = "text-sm font-normal text-muted-foreground";

export type ScreenHeaderVariantProps = VariantProps<typeof screenHeaderVariants>;
export type ScreenHeaderTitleVariantProps = VariantProps<typeof screenHeaderTitleVariants>;
