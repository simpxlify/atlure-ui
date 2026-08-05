import { iconSize, X } from "@atlure/icons";
import { Pressable, type PressableProps, View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import { touchTargetHitSlopForSize } from "../../lib/touch-target";
import {
  chipBodyClassName,
  chipDismissClassName,
  chipHeight,
  chipLabelVariants,
  chipVariants,
} from "../../variants/chip-variants";
import { Text } from "../text/text";

export interface ChipProps
  extends Omit<PressableProps, "children" | "disabled" | "accessibilityState" | "style"> {
  label: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  onDismiss?: () => void;
  dismissAccessibilityLabel?: string;
  containerClassName?: ViewProps["className"];
}

export function Chip({
  label,
  isSelected = false,
  isDisabled = false,
  onDismiss,
  dismissAccessibilityLabel,
  accessibilityLabel,
  className,
  containerClassName,
  ...pressableProps
}: ChipProps) {
  return (
    <View className={cn(chipVariants({ isSelected, isDisabled }), containerClassName)}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ selected: isSelected, disabled: isDisabled }}
        aria-selected={isSelected}
        aria-disabled={isDisabled}
        disabled={isDisabled}
        hitSlop={touchTargetHitSlopForSize(chipHeight)}
        className={cn(chipBodyClassName, className)}
        {...pressableProps}
      >
        <Text className={chipLabelVariants({ isSelected })}>{label}</Text>
      </Pressable>
      {onDismiss ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={dismissAccessibilityLabel ?? `Remove ${label}`}
          aria-disabled={isDisabled}
          disabled={isDisabled}
          hitSlop={touchTargetHitSlopForSize(chipHeight)}
          onPress={onDismiss}
          className={chipDismissClassName}
        >
          <X className={chipLabelVariants({ isSelected })} size={iconSize.sm} />
        </Pressable>
      ) : null}
    </View>
  );
}
