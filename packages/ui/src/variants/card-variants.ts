import { cva, type VariantProps } from "class-variance-authority";

export const cardVariants = cva("overflow-hidden rounded-lg bg-card", {
  variants: {
    variant: {
      outlined: "border border-border/20",
      elevated: "border border-border/10 shadow-md",
      flat: "border border-transparent",
    },
    isPressable: {
      true: "min-h-control-lg",
      false: "",
    },
  },
  defaultVariants: {
    variant: "outlined",
    isPressable: false,
  },
});

export const cardSectionVariants = cva("", {
  variants: {
    section: {
      header: "gap-xs px-md pb-sm pt-md",
      content: "gap-sm px-md py-sm",
      footer: "flex-row items-center justify-between px-md pb-md pt-sm",
    },
  },
  defaultVariants: {
    section: "content",
  },
});

export type CardVariantProps = VariantProps<typeof cardVariants>;
export type CardSectionVariantProps = VariantProps<typeof cardSectionVariants>;
