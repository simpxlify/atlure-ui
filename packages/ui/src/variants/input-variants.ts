import { cva, type VariantProps } from "class-variance-authority";

export const inputVariants = cva(
  "w-full rounded-md border bg-input-background px-md text-base text-foreground",
  {
    variants: {
      size: {
        sm: "h-control-sm",
        md: "h-control-md",
        lg: "h-control-lg",
      },
      isInvalid: {
        true: "border-destructive",
        false: "border-border/20",
      },
      isDisabled: {
        true: "opacity-50",
        false: "",
      },
      isMultiline: {
        true: "h-auto min-h-control-lg py-sm",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      isInvalid: false,
      isDisabled: false,
      isMultiline: false,
    },
  },
);

export type InputVariantProps = VariantProps<typeof inputVariants>;
