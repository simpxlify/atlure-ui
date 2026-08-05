import { cva, type VariantProps } from "class-variance-authority";

export const segmentedControlClassName =
  "flex-row items-center rounded-full border border-border/20 bg-muted p-xs";

export const segmentedControlSegmentVariants = cva(
  "flex-1 items-center justify-center rounded-full px-md py-sm",
  {
    variants: {
      isSelected: {
        true: "bg-background",
        false: "bg-transparent",
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
  },
);

export const segmentedControlLabelVariants = cva("text-sm", {
  variants: {
    isSelected: {
      true: "font-semibold text-foreground",
      false: "font-medium text-muted-foreground",
    },
  },
  defaultVariants: {
    isSelected: false,
  },
});

export type SegmentedControlSegmentVariantProps = VariantProps<
  typeof segmentedControlSegmentVariants
>;
export type SegmentedControlLabelVariantProps = VariantProps<typeof segmentedControlLabelVariants>;
