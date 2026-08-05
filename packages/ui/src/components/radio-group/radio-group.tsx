import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Pressable, type PressableProps, View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import { touchTargetHitSlopForSize } from "../../lib/touch-target";
import {
  radioGroupDotClassName,
  radioGroupIndicatorSize,
  radioGroupIndicatorVariants,
  radioGroupItemVariants,
  radioGroupVariants,
} from "../../variants/radio-group-variants";
import { Label } from "../label/label";
import { RadioGroupProvider, useRadioGroupControl } from "./radio-group-context";

const previousKeys = new Set(["ArrowUp", "ArrowLeft"]);
const nextKeys = new Set(["ArrowDown", "ArrowRight"]);

interface KeyboardEventLike {
  key: string;
  preventDefault: () => void;
}

function webKeyboardProps(onKeyDown: (event: KeyboardEventLike) => void): PressableProps {
  return { onKeyDown } as PressableProps;
}

export interface RadioGroupProps extends Omit<ViewProps, "accessibilityRole"> {
  value?: string;
  onValueChange: (value: string) => void;
  isDisabled?: boolean;
  children: ReactNode;
}

export function RadioGroup({
  value,
  onValueChange,
  isDisabled = false,
  className,
  children,
  ...viewProps
}: RadioGroupProps) {
  const orderedValues = useRef<string[]>([]);

  const registerValue = useCallback((itemValue: string) => {
    orderedValues.current = [...orderedValues.current, itemValue];

    return () => {
      orderedValues.current = orderedValues.current.filter((entry) => entry !== itemValue);
    };
  }, []);

  const selectAdjacent = useCallback(
    (fromValue: string, direction: 1 | -1) => {
      const values = orderedValues.current;
      const currentIndex = values.indexOf(fromValue);

      if (currentIndex === -1) {
        return;
      }

      const nextValue = values[(currentIndex + direction + values.length) % values.length];

      if (nextValue !== undefined) {
        onValueChange(nextValue);
      }
    },
    [onValueChange],
  );

  const control = useMemo(
    () => ({
      selectedValue: value,
      isDisabled,
      select: onValueChange,
      registerValue,
      selectAdjacent,
    }),
    [value, isDisabled, onValueChange, registerValue, selectAdjacent],
  );

  return (
    <View
      accessibilityRole="radiogroup"
      role="radiogroup"
      className={cn(radioGroupVariants({ isDisabled }), className)}
      {...viewProps}
    >
      <RadioGroupProvider control={control}>{children}</RadioGroupProvider>
    </View>
  );
}

export interface RadioGroupItemProps
  extends Omit<
    PressableProps,
    "children" | "disabled" | "onPress" | "accessibilityState" | "accessibilityRole"
  > {
  value: string;
  label?: string;
  isDisabled?: boolean;
}

export function RadioGroupItem({
  value,
  label,
  isDisabled = false,
  accessibilityLabel,
  className,
  ...pressableProps
}: RadioGroupItemProps) {
  const control = useRadioGroupControl();

  useEffect(() => control?.registerValue(value), [control, value]);

  const isSelected = control?.selectedValue === value;
  const isItemDisabled = isDisabled || control?.isDisabled === true;

  const handleKeyDown = (event: KeyboardEventLike) => {
    const direction = previousKeys.has(event.key) ? -1 : nextKeys.has(event.key) ? 1 : undefined;

    if (direction === undefined) {
      return;
    }

    event.preventDefault();
    control?.selectAdjacent(value, direction);
  };

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ checked: isSelected, disabled: isItemDisabled }}
      aria-checked={isSelected}
      aria-disabled={isItemDisabled}
      disabled={isItemDisabled}
      hitSlop={touchTargetHitSlopForSize(radioGroupIndicatorSize)}
      onPress={() => control?.select(value)}
      className={cn(radioGroupItemVariants({ isDisabled: isItemDisabled }), className)}
      {...webKeyboardProps(handleKeyDown)}
      {...pressableProps}
    >
      <View className={radioGroupIndicatorVariants({ isSelected })}>
        {isSelected ? <View className={radioGroupDotClassName} /> : null}
      </View>
      {label ? <Label isDisabled={isItemDisabled}>{label}</Label> : null}
    </Pressable>
  );
}
