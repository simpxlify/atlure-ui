import { cva, type VariantProps } from "class-variance-authority";

export const switchTrackVariants = cva("h-7 w-12 flex-row items-center rounded-full p-xs", {
  variants: {
    isChecked: {
      true: "justify-end bg-primary",
      false: "justify-start bg-muted",
    },
    isDisabled: {
      true: "opacity-50",
      false: "",
    },
  },
  defaultVariants: {
    isChecked: false,
    isDisabled: false,
  },
});

export const switchThumbVariants = cva("h-5 w-5 rounded-full", {
  variants: {
    isChecked: {
      true: "bg-primary-foreground",
      false: "bg-background",
    },
  },
  defaultVariants: {
    isChecked: false,
  },
});

export type SwitchTrackVariantProps = VariantProps<typeof switchTrackVariants>;
export type SwitchThumbVariantProps = VariantProps<typeof switchThumbVariants>;
