import { TextInput, type TextInputProps } from "react-native";

import { cn } from "../../lib/cn";
import { touchTargetHitSlop } from "../../lib/touch-target";
import { inputVariants, type InputVariantProps } from "../../variants/input-variants";

export interface InputProps extends Omit<TextInputProps, "editable" | "multiline"> {
  size?: NonNullable<InputVariantProps["size"]>;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isMultiline?: boolean;
}

export function Input({
  size = "md",
  isDisabled = false,
  isInvalid = false,
  isMultiline = false,
  className,
  ...textInputProps
}: InputProps) {
  return (
    <TextInput
      accessibilityState={{ disabled: isDisabled }}
      editable={!isDisabled}
      multiline={isMultiline}
      hitSlop={touchTargetHitSlop(size)}
      className={cn(inputVariants({ size, isInvalid, isDisabled, isMultiline }), className)}
      {...textInputProps}
    />
  );
}
