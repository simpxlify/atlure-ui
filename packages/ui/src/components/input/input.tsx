import type { ComponentRef, ReactNode, Ref } from "react";
import { Platform, TextInput, type TextInputProps, View } from "react-native";

import { cn } from "../../lib/cn";
import { touchTargetHitSlop } from "../../lib/touch-target";
import {
  inputFieldWrapperClassName,
  inputIconSlotVariants,
  inputVariants,
  type InputVariantProps,
} from "../../variants/input-variants";
import { useFormFieldControl } from "../form-field/form-field-context";

export interface InputProps extends Omit<TextInputProps, "editable" | "multiline"> {
  size?: NonNullable<InputVariantProps["size"]>;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  isMultiline?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  ref?: Ref<ComponentRef<typeof TextInput>>;
}

const CONTROL_HEIGHT_PX: Record<NonNullable<InputVariantProps["size"]>, number> = {
  sm: 36,
  md: 40,
  lg: 48,
};

function singleLineVerticalFix(
  size: NonNullable<InputVariantProps["size"]>,
): { paddingTop: 0; paddingBottom: 0; lineHeight: number; includeFontPadding?: false } {
  const base = {
    paddingTop: 0 as const,
    paddingBottom: 0 as const,
    lineHeight: CONTROL_HEIGHT_PX[size],
  };
  return Platform.OS === "android"
    ? { ...base, includeFontPadding: false as const }
    : base;
}

export function Input({
  size = "md",
  isDisabled,
  isInvalid,
  isRequired,
  isMultiline = false,
  leadingIcon,
  trailingIcon,
  className,
  nativeID,
  style,
  ...textInputProps
}: InputProps) {
  const field = useFormFieldControl();
  const isControlDisabled = isDisabled ?? field?.isDisabled ?? false;
  const isControlInvalid = isInvalid ?? field?.isInvalid ?? false;
  const isControlRequired = isRequired ?? field?.isRequired ?? false;

  const verticalFix = isMultiline ? null : singleLineVerticalFix(size);

  const control = (
    <TextInput
      accessibilityState={{ disabled: isControlDisabled }}
      accessibilityLabelledBy={field?.labelledBy}
      aria-labelledby={field?.labelledBy}
      aria-describedby={field?.describedBy}
      aria-disabled={isControlDisabled}
      aria-invalid={isControlInvalid}
      aria-required={isControlRequired}
      nativeID={nativeID ?? field?.nativeID}
      editable={!isControlDisabled}
      multiline={isMultiline}
      textAlignVertical={isMultiline ? "top" : "center"}
      hitSlop={touchTargetHitSlop(size)}
      className={cn(
        inputVariants({
          size,
          isInvalid: isControlInvalid,
          isDisabled: isControlDisabled,
          isMultiline,
          hasLeadingIcon: Boolean(leadingIcon),
          hasTrailingIcon: Boolean(trailingIcon),
        }),
        className,
      )}
      style={verticalFix ? [verticalFix, style] : style}
      {...textInputProps}
    />
  );

  if (!leadingIcon && !trailingIcon) {
    return control;
  }

  return (
    <View className={inputFieldWrapperClassName}>
      {leadingIcon ? (
        <View className={inputIconSlotVariants({ slot: "leading" })}>{leadingIcon}</View>
      ) : null}
      {control}
      {trailingIcon ? (
        <View className={inputIconSlotVariants({ slot: "trailing" })}>{trailingIcon}</View>
      ) : null}
    </View>
  );
}
