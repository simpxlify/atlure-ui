import { cva, type VariantProps } from "class-variance-authority";

export const chipHeight = 32;

export const chipVariants = cva("flex-row items-center self-start rounded-full border", {
  variants: {
    isSelected: {
      true: "border-primary bg-primary",
      false: "border-border/20 bg-transparent",
    },
    isDisabled: {
      true: "opacity-50",
      false: "",
    },
  },
  defaultVariants: {
    isSelected: false,
    isDisabled: false,
  },
});

export const chipBodyClassName = "flex-row items-center px-md py-xs";
export const chipDismissClassName = "flex-row items-center py-xs pl-xs pr-md";

export const chipLabelVariants = cva("text-sm font-medium", {
  variants: {
    isSelected: {
      true: "text-primary-foreground",
      false: "text-foreground",
    },
  },
  defaultVariants: {
    isSelected: false,
  },
});

export type ChipVariantProps = VariantProps<typeof chipVariants>;
export type ChipLabelVariantProps = VariantProps<typeof chipLabelVariants>;
