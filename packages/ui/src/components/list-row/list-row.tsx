import { ChevronRight, iconSize } from "@atlure/icons";
import type { ReactNode } from "react";
import { Pressable, type PressableProps, View } from "react-native";

import { cn } from "../../lib/cn";
import { touchTargetHitSlop } from "../../lib/touch-target";
import {
  listRowChevronClassName,
  listRowTextClassName,
  listRowTrailingClassName,
  listRowVariants,
} from "../../variants/list-row-variants";
import { Text } from "../text/text";

export interface ListRowProps
  extends Omit<PressableProps, "children" | "disabled" | "accessibilityState"> {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  hasChevron?: boolean;
  isDisabled?: boolean;
}

export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  hasChevron = false,
  isDisabled = false,
  onPress,
  accessibilityLabel,
  className,
  ...pressableProps
}: ListRowProps) {
  const content = (
    <>
      {leading}
      <View className={listRowTextClassName}>
        <Text variant="body">{title}</Text>
        {subtitle ? (
          <Text variant="bodySm" tone="muted">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing ? <View className={listRowTrailingClassName}>{trailing}</View> : null}
      {hasChevron ? (
        <ChevronRight size={iconSize.md} className={listRowChevronClassName} />
      ) : null}
    </>
  );

  if (!onPress) {
    return (
      <View className={cn(listRowVariants({ isDisabled }), className)}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled }}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      hitSlop={touchTargetHitSlop("md")}
      onPress={onPress}
      className={cn(listRowVariants({ isDisabled }), className)}
      {...pressableProps}
    >
      {content}
    </Pressable>
  );
}
