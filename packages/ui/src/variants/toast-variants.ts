import { cva, type VariantProps } from "class-variance-authority";

export const toastViewportClassName = "absolute inset-x-0 bottom-0 px-md";

export const toastVariants = cva("w-full flex-row items-center gap-sm rounded-lg p-md", {
  variants: {
    variant: {
      default: "bg-card",
      success: "bg-primary",
      error: "bg-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const toastMessageVariants = cva("flex-1 text-base", {
  variants: {
    variant: {
      default: "text-foreground",
      success: "text-primary-foreground",
      error: "text-destructive-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type ToastVariantProps = VariantProps<typeof toastVariants>;
