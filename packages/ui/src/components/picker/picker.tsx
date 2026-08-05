import { Pressable, ScrollView, View } from "react-native";

import { cn } from "../../lib/cn";
import { touchTargetHitSlop } from "../../lib/touch-target";
import { useSheet } from "../../lib/use-sheet";
import { inputVariants, type InputVariantProps } from "../../variants/input-variants";
import {
  selectOptionListClassName,
  selectTriggerClassName,
  selectValueVariants,
} from "../../variants/select-variants";
import { SelectItem, type SelectOption, type SelectValue } from "../select/select";
import { Sheet } from "../sheet/sheet";
import { Text } from "../text/text";

export interface PickerProps<TValue extends SelectValue> {
  options: readonly SelectOption<TValue>[];
  values: readonly NoInfer<TValue>[];
  onValuesChange: (values: NoInfer<TValue>[]) => void;
  placeholder: string;
  accessibilityLabel: string;
  backdropAccessibilityLabel: string;
  size?: NonNullable<InputVariantProps["size"]>;
  isDisabled?: boolean;
  isInvalid?: boolean;
  snapPoints?: readonly number[];
  bottomInset?: number;
  className?: string;
}

export function Picker<TValue extends SelectValue>({
  options,
  values,
  onValuesChange,
  placeholder,
  accessibilityLabel,
  backdropAccessibilityLabel,
  size = "md",
  isDisabled = false,
  isInvalid = false,
  snapPoints,
  bottomInset,
  className,
}: PickerProps<TValue>) {
  const sheet = useSheet();
  const selectedLabels = options
    .filter((option) => values.includes(option.value))
    .map((option) => option.label);

  return (
    <>
      <Pressable
        accessibilityRole="combobox"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: isDisabled, expanded: sheet.isOpen }}
        accessibilityValue={{ text: selectedLabels.join(", ") || placeholder }}
        aria-disabled={isDisabled}
        aria-expanded={sheet.isOpen}
        aria-invalid={isInvalid}
        aria-multiselectable
        disabled={isDisabled}
        hitSlop={touchTargetHitSlop(size)}
        onPress={sheet.open}
        className={cn(
          inputVariants({ size, isInvalid, isDisabled }),
          selectTriggerClassName,
          className,
        )}
      >
        <Text className={selectValueVariants({ isPlaceholder: selectedLabels.length === 0 })}>
          {selectedLabels.join(", ") || placeholder}
        </Text>
      </Pressable>
      <Sheet
        isOpen={sheet.isOpen}
        onClose={sheet.close}
        accessibilityLabel={accessibilityLabel}
        backdropAccessibilityLabel={backdropAccessibilityLabel}
        snapPoints={snapPoints}
        bottomInset={bottomInset}
      >
        <ScrollView className={selectOptionListClassName}>
          <View accessibilityRole="menu">
            {options.map((option) => (
              <SelectItem
                key={option.value}
                label={option.label}
                isSelected={values.includes(option.value)}
                isDisabled={option.isDisabled}
                onPress={() =>
                  onValuesChange(
                    values.includes(option.value)
                      ? values.filter((selected) => selected !== option.value)
                      : [...values, option.value],
                  )
                }
              />
            ))}
          </View>
        </ScrollView>
      </Sheet>
    </>
  );
}
