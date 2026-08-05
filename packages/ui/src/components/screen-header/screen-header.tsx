import { ChevronLeft, iconSize } from "@atlure/icons";
import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import {
  screenHeaderActionsClassName,
  screenHeaderSubtitleClassName,
  screenHeaderTextClassName,
  screenHeaderTitleVariants,
  screenHeaderVariants,
  type ScreenHeaderVariantProps,
} from "../../variants/screen-header-variants";
import { IconButton } from "../icon-button/icon-button";
import { Text } from "../text/text";

export const SCREEN_HEADER_BACK_LABEL = "Go back";

export interface ScreenHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  variant?: NonNullable<ScreenHeaderVariantProps["variant"]>;
  onBack?: () => void;
  backAccessibilityLabel?: string;
  right?: ReactNode;
  topInset?: number;
}

export function ScreenHeader({
  title,
  subtitle,
  variant = "default",
  onBack,
  backAccessibilityLabel = SCREEN_HEADER_BACK_LABEL,
  right,
  topInset = 0,
  className,
  style,
  ...viewProps
}: ScreenHeaderProps) {
  return (
    <View
      className={cn(screenHeaderVariants({ variant }), className)}
      style={[{ paddingTop: topInset }, style]}
      {...viewProps}
    >
      {onBack ? (
        <IconButton
          accessibilityLabel={backAccessibilityLabel}
          icon={<ChevronLeft size={iconSize.md} />}
          onPress={onBack}
          variant="ghost"
        />
      ) : null}
      <View className={screenHeaderTextClassName}>
        <Text className={screenHeaderTitleVariants({ variant })}>{title}</Text>
        {subtitle ? <Text className={screenHeaderSubtitleClassName}>{subtitle}</Text> : null}
      </View>
      {right ? <View className={screenHeaderActionsClassName}>{right}</View> : null}
    </View>
  );
}
