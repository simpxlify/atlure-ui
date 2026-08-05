import { cva, type VariantProps } from "class-variance-authority";

export const formFieldClassName = "w-full gap-xs";

export const formFieldMessageVariants = cva("", {
  variants: {
    isInvalid: {
      true: "text-destructive",
      false: "text-muted-foreground",
    },
  },
  defaultVariants: {
    isInvalid: false,
  },
});

export type FormFieldMessageVariantProps = VariantProps<typeof formFieldMessageVariants>;
