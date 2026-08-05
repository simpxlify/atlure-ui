import { cva, type VariantProps } from "class-variance-authority";

export const switchTrackHeight = {
  sm: 24,
  md: 28,
} as const;

export const switchThumbTravel = {
  sm: 16,
  md: 20,
} as const;

export type SwitchSize = keyof typeof switchTrackHeight;

export const switchTrackVariants = cva("flex-row items-center rounded-full p-xs", {
  variants: {
    size: {
      sm: "h-6 w-10",
      md: "h-7 w-12",
    },
    isChecked: {
      true: "bg-primary",
      false: "bg-muted",
    },
    isDisabled: {
      true: "opacity-50",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    isChecked: false,
    isDisabled: false,
  },
});

export const switchThumbVariants = cva("rounded-full", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-5 w-5",
    },
    isChecked: {
      true: "bg-primary-foreground",
      false: "bg-background",
    },
  },
  defaultVariants: {
    size: "md",
    isChecked: false,
  },
});

export type SwitchTrackVariantProps = VariantProps<typeof switchTrackVariants>;
export type SwitchThumbVariantProps = VariantProps<typeof switchThumbVariants>;
