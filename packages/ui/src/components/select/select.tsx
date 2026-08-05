import { Check, iconSize } from "@atlure/icons";
import { Pressable, ScrollView, View } from "react-native";

import { cn } from "../../lib/cn";
import { touchTargetHitSlop } from "../../lib/touch-target";
import { useSheet } from "../../lib/use-sheet";
import { inputVariants, type InputVariantProps } from "../../variants/input-variants";
import {
  selectItemLabelVariants,
  selectItemVariants,
  selectOptionListClassName,
  selectTriggerClassName,
  selectValueVariants,
} from "../../variants/select-variants";
import { Sheet } from "../sheet/sheet";
import { Text } from "../text/text";

export type SelectValue = string | number;

export interface SelectOption<TValue extends SelectValue> {
  value: TValue;
  label: string;
  isDisabled?: boolean;
}

export interface SelectItemProps {
  label: string;
  isSelected: boolean;
  isDisabled?: boolean;
  onPress: () => void;
}

export function SelectItem({ label, isSelected, isDisabled = false, onPress }: SelectItemProps) {
  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityLabel={label}
      accessibilityState={{ selected: isSelected, disabled: isDisabled }}
      aria-selected={isSelected}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      hitSlop={touchTargetHitSlop("md")}
      onPress={onPress}
      className={selectItemVariants({ isDisabled })}
    >
      <Text className={selectItemLabelVariants({ isSelected })}>{label}</Text>
      {isSelected ? <Check size={iconSize.md} /> : null}
    </Pressable>
  );
}

export interface SelectProps<TValue extends SelectValue> {
  options: readonly SelectOption<TValue>[];
  value: NoInfer<TValue> | null;
  onValueChange: (value: NoInfer<TValue>) => void;
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

export function Select<TValue extends SelectValue>({
  options,
  value,
  onValueChange,
  placeholder,
  accessibilityLabel,
  backdropAccessibilityLabel,
  size = "md",
  isDisabled = false,
  isInvalid = false,
  snapPoints,
  bottomInset,
  className,
}: SelectProps<TValue>) {
  const sheet = useSheet();
  const selectedOption = options.find((option) => option.value === value) ?? null;

  return (
    <>
      <Pressable
        accessibilityRole="combobox"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: isDisabled, expanded: sheet.isOpen }}
        accessibilityValue={{ text: selectedOption?.label ?? placeholder }}
        aria-disabled={isDisabled}
        aria-expanded={sheet.isOpen}
        aria-invalid={isInvalid}
        disabled={isDisabled}
        hitSlop={touchTargetHitSlop(size)}
        onPress={sheet.open}
        className={cn(
          inputVariants({ size, isInvalid, isDisabled }),
          selectTriggerClassName,
          className,
        )}
      >
        <Text className={selectValueVariants({ isPlaceholder: selectedOption === null })}>
          {selectedOption?.label ?? placeholder}
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
                isSelected={option.value === value}
                isDisabled={option.isDisabled}
                onPress={() => {
                  onValueChange(option.value);
                  sheet.close();
                }}
              />
            ))}
          </View>
        </ScrollView>
      </Sheet>
    </>
  );
}
