import { Image, View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import {
  avatarFallbackVariants,
  avatarVariants,
  type AvatarVariantProps,
} from "../../variants/avatar-variants";
import { Text } from "../text/text";
import { toInitials } from "./utils";

export interface AvatarProps extends ViewProps {
  name: string;
  uri?: string | null;
  size?: NonNullable<AvatarVariantProps["size"]>;
  hasRing?: boolean;
}

export function Avatar({
  name,
  uri = null,
  size = "md",
  hasRing = false,
  className,
  ...viewProps
}: AvatarProps) {
  const initials = toInitials(name);

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={name}
      className={cn(avatarVariants({ size, hasRing }), className)}
      {...viewProps}
    >
      {uri ? (
        <Image source={{ uri }} accessibilityLabel={name} className="h-full w-full" />
      ) : (
        <Text className={avatarFallbackVariants({ size })}>{initials}</Text>
      )}
    </View>
  );
}
