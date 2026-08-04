import { View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import {
  badgeLabelVariants,
  badgeVariants,
  type BadgeVariantProps,
} from "../../variants/badge-variants";
import { Text } from "../text/text";

export interface BadgeProps extends ViewProps {
  label: string;
  variant?: NonNullable<BadgeVariantProps["variant"]>;
  size?: NonNullable<BadgeVariantProps["size"]>;
  labelClassName?: string;
}

export function Badge({
  label,
  variant = "primary",
  size = "sm",
  className,
  labelClassName,
  ...viewProps
}: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant, size }), className)} {...viewProps}>
      <Text className={cn(badgeLabelVariants({ variant, size }), labelClassName)}>{label}</Text>
    </View>
  );
}
