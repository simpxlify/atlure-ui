import { semantic } from "@atlure/tokens";
import { ActivityIndicator, useColorScheme, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import { spinnerVariants, type SpinnerVariantProps } from "../../variants/spinner-variants";

export interface SpinnerProps extends Omit<ViewProps, "children"> {
  size?: NonNullable<SpinnerVariantProps["size"]>;
  accessibilityLabel: string;
}

const ACTIVITY_INDICATOR_SIZE = {
  sm: "small",
  md: "large",
} as const;

export function Spinner({
  size = "md",
  accessibilityLabel,
  className,
  ...viewProps
}: SpinnerProps) {
  const colorScheme = useColorScheme();

  return (
    <ActivityIndicator
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ busy: true }}
      aria-busy
      size={ACTIVITY_INDICATOR_SIZE[size]}
      color={semantic[colorScheme === "dark" ? "dark" : "light"].primary}
      className={cn(spinnerVariants({ size }), className)}
      {...viewProps}
    />
  );
}
