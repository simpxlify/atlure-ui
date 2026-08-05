import { cva, type VariantProps } from "class-variance-authority";

export const selectTriggerClassName = "flex-row items-center justify-between gap-sm";

export const selectValueVariants = cva("flex-1 text-base", {
  variants: {
    isPlaceholder: {
      true: "text-muted-foreground",
      false: "text-foreground",
    },
  },
  defaultVariants: {
    isPlaceholder: false,
  },
});

export const selectItemVariants = cva(
  "min-h-control-md flex-row items-center justify-between py-sm",
  {
    variants: {
      isDisabled: {
        true: "opacity-50",
        false: "",
      },
    },
    defaultVariants: {
      isDisabled: false,
    },
  },
);

export const selectItemLabelVariants = cva("flex-1 text-base", {
  variants: {
    isSelected: {
      true: "font-semibold text-foreground",
      false: "text-foreground",
    },
  },
  defaultVariants: {
    isSelected: false,
  },
});

export const selectOptionListClassName = "flex-1";

export type SelectValueVariantProps = VariantProps<typeof selectValueVariants>;
export type SelectItemVariantProps = VariantProps<typeof selectItemVariants>;
export type SelectItemLabelVariantProps = VariantProps<typeof selectItemLabelVariants>;
