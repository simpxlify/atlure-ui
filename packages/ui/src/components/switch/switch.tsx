import { Pressable, type PressableProps, View } from "react-native";

import { cn } from "../../lib/cn";
import { touchTargetHitSlop } from "../../lib/touch-target";
import { switchThumbVariants, switchTrackVariants } from "../../variants/switch-variants";
import { Label } from "../label/label";

export interface SwitchProps
  extends Omit<PressableProps, "children" | "disabled" | "onPress" | "accessibilityState"> {
  isChecked: boolean;
  onValueChange: (isChecked: boolean) => void;
  label?: string;
  isDisabled?: boolean;
}

export function Switch({
  isChecked,
  onValueChange,
  label,
  isDisabled = false,
  accessibilityLabel,
  className,
  ...pressableProps
}: SwitchProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ checked: isChecked, disabled: isDisabled }}
      aria-checked={isChecked}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      hitSlop={touchTargetHitSlop("md")}
      onPress={() => onValueChange(!isChecked)}
      className={cn("flex-row items-center gap-sm", className)}
      {...pressableProps}
    >
      <View className={switchTrackVariants({ isChecked, isDisabled })}>
        <View className={switchThumbVariants({ isChecked })} />
      </View>
      {label ? <Label isDisabled={isDisabled}>{label}</Label> : null}
    </Pressable>
  );
}
