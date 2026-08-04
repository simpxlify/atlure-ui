import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "flex-row items-center justify-center rounded-md border border-transparent",
  {
    variants: {
      variant: {
        primary: "bg-primary",
        secondary: "bg-secondary",
        outline: "border-border/20 bg-transparent",
        ghost: "bg-transparent",
        destructive: "bg-destructive",
      },
      size: {
        sm: "h-control-sm px-sm",
        md: "h-control-md px-md",
        lg: "h-control-lg px-lg",
      },
      isFullWidth: {
        true: "w-full",
        false: "self-start",
      },
      isDisabled: {
        true: "opacity-50",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      isFullWidth: false,
      isDisabled: false,
    },
  },
);

export const buttonLabelVariants = cva("text-center font-medium", {
  variants: {
    variant: {
      primary: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      outline: "text-foreground",
      ghost: "text-foreground",
      destructive: "text-destructive-foreground",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-base",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
export type ButtonLabelVariantProps = VariantProps<typeof buttonLabelVariants>;
