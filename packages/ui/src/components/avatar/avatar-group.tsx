import { Children, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import {
  avatarFallbackVariants,
  avatarGroupItemVariants,
  avatarGroupVariants,
  avatarVariants,
  type AvatarVariantProps,
} from "../../variants/avatar-variants";
import { Text } from "../text/text";

export interface AvatarGroupProps extends Omit<ViewProps, "children"> {
  children: ReactNode;
  max?: number;
  size?: NonNullable<AvatarVariantProps["size"]>;
  overflowAccessibilityLabel?: string;
}

export function AvatarGroup({
  children,
  max = 4,
  size = "md",
  overflowAccessibilityLabel,
  className,
  ...viewProps
}: AvatarGroupProps) {
  const avatars = Children.toArray(children);
  const visibleAvatars = avatars.slice(0, max);
  const overflowCount = avatars.length - visibleAvatars.length;

  return (
    <View accessibilityRole="list" className={cn(avatarGroupVariants(), className)} {...viewProps}>
      {visibleAvatars.map((avatar, index) => (
        <View key={index} className={avatarGroupItemVariants({ size, isFirst: index === 0 })}>
          {avatar}
        </View>
      ))}
      {overflowCount > 0 ? (
        <View
          accessibilityLabel={overflowAccessibilityLabel ?? `+${overflowCount}`}
          className={avatarGroupItemVariants({ size, isFirst: false })}
        >
          <View className={avatarVariants({ size })}>
            <Text className={avatarFallbackVariants({ size })}>{`+${overflowCount}`}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
