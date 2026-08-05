import { cva, type VariantProps } from "class-variance-authority";

export const listRowVariants = cva(
  "w-full min-h-control-lg flex-row items-center gap-md px-md py-sm",
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

export const listRowTextClassName = "flex-1 gap-xs";

export const listRowTrailingClassName = "items-end justify-center";

export const listRowChevronClassName = "text-muted-foreground";

export type ListRowVariantProps = VariantProps<typeof listRowVariants>;
