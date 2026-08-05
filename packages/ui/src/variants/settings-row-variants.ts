import { cva, type VariantProps } from "class-variance-authority";

export const settingsRowVariants = cva("flex-row items-center gap-md py-sm", {
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

export const settingsRowTextClassName = "flex-1 flex-col gap-xs";
export const settingsRowControlClassName = "shrink-0";

export type SettingsRowVariantProps = VariantProps<typeof settingsRowVariants>;
