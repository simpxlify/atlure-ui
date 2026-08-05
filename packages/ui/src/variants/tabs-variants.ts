import { cva, type VariantProps } from "class-variance-authority";

export const tabsIndicatorHeight = 2;

export const tabsListClassName = "relative flex-row items-end border-b border-border/20";
export const tabsIndicatorClassName = "h-full w-full rounded-full bg-primary";

export const tabsTriggerVariants = cva("items-center justify-center px-md py-sm", {
  variants: {
    isDisabled: {
      true: "opacity-50",
      false: "",
    },
  },
  defaultVariants: {
    isDisabled: false,
  },
});

export const tabsTriggerLabelVariants = cva("text-sm", {
  variants: {
    isActive: {
      true: "font-semibold text-primary",
      false: "font-medium text-muted-foreground",
    },
  },
  defaultVariants: {
    isActive: false,
  },
});

export const tabsContentVariants = cva("flex-1", {
  variants: {
    isActive: {
      true: "",
      false: "hidden",
    },
  },
  defaultVariants: {
    isActive: true,
  },
});

export type TabsTriggerVariantProps = VariantProps<typeof tabsTriggerVariants>;
export type TabsTriggerLabelVariantProps = VariantProps<typeof tabsTriggerLabelVariants>;
export type TabsContentVariantProps = VariantProps<typeof tabsContentVariants>;
