import { Pressable, View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import {
  segmentedControlClassName,
  segmentedControlLabelVariants,
  segmentedControlSegmentVariants,
} from "../../variants/segmented-control-variants";
import { Text } from "../text/text";

export interface SegmentedControlOption {
  value: string;
  label: string;
  isDisabled?: boolean;
}

export interface SegmentedControlProps extends Omit<ViewProps, "children"> {
  accessibilityLabel: string;
  options: readonly SegmentedControlOption[];
  value: string;
  onValueChange: (value: string) => void;
  isDisabled?: boolean;
}

export function SegmentedControl({
  accessibilityLabel,
  options,
  value,
  onValueChange,
  isDisabled = false,
  className,
  ...viewProps
}: SegmentedControlProps) {
  return (
    <View
      accessibilityRole="tablist"
      role="tablist"
      accessibilityLabel={accessibilityLabel}
      className={cn(segmentedControlClassName, className)}
      {...viewProps}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        const isSegmentDisabled = isDisabled || option.isDisabled === true;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: isSelected, disabled: isSegmentDisabled }}
            aria-selected={isSelected}
            aria-disabled={isSegmentDisabled}
            disabled={isSegmentDisabled}
            onPress={() => onValueChange(option.value)}
            className={segmentedControlSegmentVariants({
              isSelected,
              isDisabled: isSegmentDisabled,
            })}
          >
            <Text className={segmentedControlLabelVariants({ isSelected })}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
