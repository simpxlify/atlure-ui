import { useEffect, useRef } from "react";
import { Animated, Pressable, type PressableProps, View } from "react-native";

import { cn } from "../../lib/cn";
import { touchTargetHitSlopForSize } from "../../lib/touch-target";
import {
  switchThumbTravel,
  switchThumbVariants,
  switchTrackHeight,
  switchTrackVariants,
  type SwitchSize,
} from "../../variants/switch-variants";
import { Label } from "../label/label";

const thumbTransitionDurationMs = 150;

export interface SwitchProps
  extends Omit<PressableProps, "children" | "disabled" | "onPress" | "accessibilityState"> {
  isChecked: boolean;
  onValueChange: (isChecked: boolean) => void;
  label?: string;
  size?: SwitchSize;
  isDisabled?: boolean;
}

export function Switch({
  isChecked,
  onValueChange,
  label,
  size = "md",
  isDisabled = false,
  accessibilityLabel,
  className,
  ...pressableProps
}: SwitchProps) {
  const travel = switchThumbTravel[size];
  const thumbOffset = useRef(new Animated.Value(isChecked ? travel : 0)).current;

  useEffect(() => {
    const animation = Animated.timing(thumbOffset, {
      toValue: isChecked ? travel : 0,
      duration: thumbTransitionDurationMs,
      useNativeDriver: true,
    });

    animation.start();

    return () => animation.stop();
  }, [isChecked, travel, thumbOffset]);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ checked: isChecked, disabled: isDisabled }}
      aria-checked={isChecked}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      hitSlop={touchTargetHitSlopForSize(switchTrackHeight[size])}
      onPress={() => onValueChange(!isChecked)}
      className={cn("flex-row items-center gap-sm", className)}
      {...pressableProps}
    >
      <View className={switchTrackVariants({ size, isChecked, isDisabled })}>
        <Animated.View style={{ transform: [{ translateX: thumbOffset }] }}>
          <View className={switchThumbVariants({ size, isChecked })} />
        </Animated.View>
      </View>
      {label ? <Label isDisabled={isDisabled}>{label}</Label> : null}
    </Pressable>
  );
}
