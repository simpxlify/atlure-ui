import { Check, iconSize, Minus } from "@atlure/icons";
import { Pressable, type PressableProps, View } from "react-native";

import { cn } from "../../lib/cn";
import { touchTargetHitSlopForSize } from "../../lib/touch-target";
import {
  checkboxBoxSize,
  checkboxBoxVariants,
  checkboxIndicatorClassName,
  checkboxRowVariants,
} from "../../variants/checkbox-variants";
import { Label } from "../label/label";

export interface CheckboxProps
  extends Omit<PressableProps, "children" | "disabled" | "onPress" | "accessibilityState"> {
  isChecked: boolean;
  onValueChange: (isChecked: boolean) => void;
  label?: string;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
}

export function Checkbox({
  isChecked,
  onValueChange,
  label,
  isIndeterminate = false,
  isDisabled = false,
  isInvalid = false,
  accessibilityLabel,
  className,
  ...pressableProps
}: CheckboxProps) {
  const checkedState = isIndeterminate ? "mixed" : isChecked;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ checked: checkedState, disabled: isDisabled }}
      aria-checked={checkedState}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      hitSlop={touchTargetHitSlopForSize(checkboxBoxSize)}
      onPress={() => onValueChange(isIndeterminate ? true : !isChecked)}
      className={cn(checkboxRowVariants({ isDisabled }), className)}
      {...pressableProps}
    >
      <View
        className={checkboxBoxVariants({ isSelected: isIndeterminate || isChecked, isInvalid })}
      >
        {isIndeterminate ? (
          <Minus size={iconSize.sm} className={checkboxIndicatorClassName} />
        ) : null}
        {!isIndeterminate && isChecked ? (
          <Check size={iconSize.sm} className={checkboxIndicatorClassName} />
        ) : null}
      </View>
      {label ? (
        <Label isDisabled={isDisabled} isInvalid={isInvalid}>
          {label}
        </Label>
      ) : null}
    </Pressable>
  );
}
