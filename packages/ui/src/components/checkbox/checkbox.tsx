import { Pressable, type PressableProps, View } from "react-native";

import { cn } from "../../lib/cn";
import { touchTargetHitSlop } from "../../lib/touch-target";
import {
  checkboxBoxVariants,
  checkboxIndicatorVariants,
  checkboxRowVariants,
} from "../../variants/checkbox-variants";
import { Label } from "../label/label";

export interface CheckboxProps
  extends Omit<PressableProps, "children" | "disabled" | "onPress" | "accessibilityState"> {
  isChecked: boolean;
  onValueChange: (isChecked: boolean) => void;
  label?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
}

export function Checkbox({
  isChecked,
  onValueChange,
  label,
  isDisabled = false,
  isInvalid = false,
  accessibilityLabel,
  className,
  ...pressableProps
}: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ checked: isChecked, disabled: isDisabled }}
      disabled={isDisabled}
      hitSlop={touchTargetHitSlop("md")}
      onPress={() => onValueChange(!isChecked)}
      className={cn(checkboxRowVariants({ isDisabled }), className)}
      {...pressableProps}
    >
      <View className={checkboxBoxVariants({ isChecked, isInvalid })}>
        <View className={checkboxIndicatorVariants({ isChecked })} />
      </View>
      {label ? <Label isDisabled={isDisabled} isInvalid={isInvalid}>{label}</Label> : null}
    </Pressable>
  );
}
