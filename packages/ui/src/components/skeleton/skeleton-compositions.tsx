import { View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import { skeletonCompositionVariants } from "../../variants/skeleton-variants";
import { Skeleton } from "./skeleton";

export interface SkeletonCompositionProps extends Omit<ViewProps, "children"> {
  accessibilityLabel: string;
  isAnimated?: boolean;
}

export function SkeletonCard({
  accessibilityLabel,
  isAnimated = true,
  className,
  ...viewProps
}: SkeletonCompositionProps) {
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      className={cn(skeletonCompositionVariants({ composition: "card" }), className)}
      {...viewProps}
    >
      <Skeleton accessibilityLabel={accessibilityLabel} isAnimated={isAnimated} shape="block" />
      <Skeleton accessibilityLabel={accessibilityLabel} isAnimated={isAnimated} shape="title" />
      <Skeleton accessibilityLabel={accessibilityLabel} isAnimated={isAnimated} shape="line" />
    </View>
  );
}

export function SkeletonListRow({
  accessibilityLabel,
  isAnimated = true,
  className,
  ...viewProps
}: SkeletonCompositionProps) {
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      className={cn(skeletonCompositionVariants({ composition: "listRow" }), className)}
      {...viewProps}
    >
      <Skeleton accessibilityLabel={accessibilityLabel} isAnimated={isAnimated} shape="title" />
      <Skeleton accessibilityLabel={accessibilityLabel} isAnimated={isAnimated} shape="line" />
    </View>
  );
}

export function SkeletonAvatarRow({
  accessibilityLabel,
  isAnimated = true,
  className,
  ...viewProps
}: SkeletonCompositionProps) {
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      className={cn(skeletonCompositionVariants({ composition: "avatarRow" }), className)}
      {...viewProps}
    >
      <Skeleton accessibilityLabel={accessibilityLabel} isAnimated={isAnimated} shape="circle" />
      <View className={skeletonCompositionVariants({ composition: "avatarRowText" })}>
        <Skeleton accessibilityLabel={accessibilityLabel} isAnimated={isAnimated} shape="title" />
        <Skeleton accessibilityLabel={accessibilityLabel} isAnimated={isAnimated} shape="line" />
      </View>
    </View>
  );
}
