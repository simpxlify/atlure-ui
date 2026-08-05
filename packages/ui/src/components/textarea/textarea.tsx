import { View } from "react-native";

import { cn } from "../../lib/cn";
import { formFieldClassName } from "../../variants/form-field-variants";
import {
  textareaCounterClassName,
  textareaVariants,
  type TextareaRows,
} from "../../variants/textarea-variants";
import { Input, type InputProps } from "../input/input";
import { Text } from "../text/text";

export interface TextareaProps extends Omit<InputProps, "isMultiline" | "size" | "numberOfLines"> {
  rows?: TextareaRows;
  hasCounter?: boolean;
}

export function Textarea({
  rows = 3,
  hasCounter = false,
  maxLength,
  value,
  className,
  ...inputProps
}: TextareaProps) {
  const control = (
    <Input
      isMultiline
      size="lg"
      textAlignVertical="top"
      maxLength={maxLength}
      value={value}
      className={cn(textareaVariants({ rows }), className)}
      {...inputProps}
    />
  );

  if (!hasCounter || maxLength === undefined) {
    return control;
  }

  return (
    <View className={formFieldClassName}>
      {control}
      <Text variant="caption" tone="muted" className={textareaCounterClassName}>
        {`${value?.length ?? 0}/${maxLength}`}
      </Text>
    </View>
  );
}
