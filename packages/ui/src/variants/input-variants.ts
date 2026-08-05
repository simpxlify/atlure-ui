import { cva, type VariantProps } from "class-variance-authority";

export const inputVariants = cva(
  "w-full rounded-md border bg-input-background px-md text-base text-foreground placeholder:text-muted-foreground",
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
      hasLeadingIcon: {
        true: "pl-3xl",
        false: "",
      },
      hasTrailingIcon: {
        true: "pr-3xl",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      isInvalid: false,
      isDisabled: false,
      isMultiline: false,
      hasLeadingIcon: false,
      hasTrailingIcon: false,
    },
  },
);

export const inputIconSlotVariants = cva("absolute inset-y-0 justify-center", {
  variants: {
    slot: {
      leading: "pointer-events-none left-md",
      trailing: "right-md",
    },
  },
  defaultVariants: {
    slot: "leading",
  },
});

export const inputFieldWrapperClassName = "relative w-full justify-center";

export type InputVariantProps = VariantProps<typeof inputVariants>;
export type InputIconSlotVariantProps = VariantProps<typeof inputIconSlotVariants>;
