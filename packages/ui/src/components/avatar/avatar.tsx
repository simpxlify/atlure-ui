import { useState } from "react";
import { Image, View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import {
  avatarFallbackVariants,
  avatarPresenceVariants,
  avatarRootVariants,
  avatarVariants,
  type AvatarVariantProps,
} from "../../variants/avatar-variants";
import { Skeleton } from "../skeleton/skeleton";
import { Text } from "../text/text";
import { toInitials } from "./utils";

export type AvatarPresence = "online" | "offline" | "none";

export interface AvatarProps extends ViewProps {
  name: string;
  src?: string | null;
  uri?: string | null;
  size?: NonNullable<AvatarVariantProps["size"]>;
  shape?: NonNullable<AvatarVariantProps["shape"]>;
  presence?: AvatarPresence;
  presenceAccessibilityLabel?: string;
  loadingAccessibilityLabel?: string;
  hasRing?: boolean;
}

export function Avatar({
  name,
  src = null,
  uri = null,
  size = "md",
  shape = "circle",
  presence = "none",
  presenceAccessibilityLabel,
  loadingAccessibilityLabel,
  hasRing = false,
  className,
  ...viewProps
}: AvatarProps) {
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const [loadedUri, setLoadedUri] = useState<string | null>(null);

  const requestedUri = src ?? uri;
  const imageUri = requestedUri && requestedUri !== failedUri ? requestedUri : null;
  const isLoading = imageUri !== null && imageUri !== loadedUri;

  return (
    <View className={avatarRootVariants()} {...viewProps}>
      <View
        accessibilityRole={imageUri ? undefined : "image"}
        accessibilityLabel={imageUri ? undefined : name}
        className={cn(avatarVariants({ size, shape, hasRing }), className)}
      >
        {imageUri ? (
          <>
            <Image
              source={{ uri: imageUri }}
              accessibilityLabel={name}
              className="h-full w-full"
              onLoadEnd={() => setLoadedUri(imageUri)}
              onError={() => setFailedUri(imageUri)}
            />
            {isLoading ? (
              <Skeleton
                shape="circle"
                accessibilityLabel={loadingAccessibilityLabel ?? name}
                className="absolute inset-0 h-full w-full"
              />
            ) : null}
          </>
        ) : (
          <Text className={avatarFallbackVariants({ size })}>{toInitials(name)}</Text>
        )}
      </View>
      {presence === "none" ? null : (
        <View
          accessibilityLabel={presenceAccessibilityLabel ?? `${name} ${presence}`}
          className={avatarPresenceVariants({ size, presence })}
        />
      )}
    </View>
  );
}
