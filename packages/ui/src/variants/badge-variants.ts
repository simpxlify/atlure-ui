import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva("flex-row items-center justify-center self-start rounded-full", {
  variants: {
    variant: {
      primary: "bg-primary",
      default: "bg-primary",
      secondary: "bg-secondary",
      outline: "border border-border/20 bg-transparent",
      success: "bg-success",
      warning: "bg-warning",
      destructive: "bg-destructive",
      muted: "bg-muted",
    },
    size: {
      sm: "px-sm py-xs",
      md: "px-md py-xs",
      default: "px-md py-xs",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "sm",
  },
});

export const badgeLabelVariants = cva("font-medium", {
  variants: {
    variant: {
      primary: "text-primary-foreground",
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      outline: "text-foreground",
      success: "text-success-foreground",
      warning: "text-warning-foreground",
      destructive: "text-destructive-foreground",
      muted: "text-muted-foreground",
    },
    size: {
      sm: "text-xs",
      md: "text-sm",
      default: "text-sm",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "sm",
  },
});

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;
export type BadgeLabelVariantProps = VariantProps<typeof badgeLabelVariants>;
