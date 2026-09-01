import type { ComponentRef, ReactNode, Ref } from "react";
import { Platform, TextInput, type TextInputProps, View } from "react-native";

import { cn } from "../../lib/cn";
import { touchTargetHitSlop } from "../../lib/touch-target";
import {
  inputIconSlotVariants,
  inputTextClassName,
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

const TEXT_INPUT_RESET =
  Platform.OS === "android"
    ? { paddingTop: 0, paddingBottom: 0, includeFontPadding: false as const }
    : { paddingTop: 0, paddingBottom: 0 };

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

  return (
    <View
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
    >
      {leadingIcon ? (
        <View className={inputIconSlotVariants({ slot: "leading" })}>{leadingIcon}</View>
      ) : null}
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
        className={inputTextClassName}
        style={[TEXT_INPUT_RESET, style]}
        {...textInputProps}
      />
      {trailingIcon ? (
        <View className={inputIconSlotVariants({ slot: "trailing" })}>{trailingIcon}</View>
      ) : null}
    </View>
  );
}
