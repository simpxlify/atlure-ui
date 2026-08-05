import { Animated, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import { skeletonVariants, type SkeletonVariantProps } from "../../variants/skeleton-variants";
import { usePulseOpacity } from "./hooks/use-pulse-opacity";
import { useReducedMotion } from "./hooks/use-reduced-motion";
import { shouldAnimateSkeleton } from "./utils";

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
  const isReducedMotion = useReducedMotion();
  const opacity = usePulseOpacity(shouldAnimateSkeleton({ isAnimated, isReducedMotion }));

  return (
    <Animated.View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ busy: true }}
      aria-busy
      className={cn(skeletonVariants({ shape }), className)}
      style={[{ opacity }, style]}
      {...viewProps}
    />
  );
}
