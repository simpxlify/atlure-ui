import { Animated, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import { skeletonVariants, type SkeletonVariantProps } from "../../variants/skeleton-variants";
import { usePulseOpacity } from "./hooks/use-pulse-opacity";

export interface SkeletonProps extends Omit<ViewProps, "children"> {
  shape?: NonNullable<SkeletonVariantProps["shape"]>;
  accessibilityLabel: string;
  isAnimated?: boolean;
}

export function Skeleton({
  shape = "line",
  accessibilityLabel,
  isAnimated = true,
  className,
  style,
  ...viewProps
}: SkeletonProps) {
  const opacity = usePulseOpacity(isAnimated);

  return (
    <Animated.View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ busy: true }}
      className={cn(skeletonVariants({ shape }), className)}
      style={[{ opacity }, style]}
      {...viewProps}
    />
  );
}
