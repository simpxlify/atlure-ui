import { useId, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import { formFieldClassName, formFieldMessageVariants } from "../../variants/form-field-variants";
import { Label } from "../label/label";
import { Text } from "../text/text";
import { FormFieldProvider } from "./form-field-context";

export interface FormFieldProps extends Omit<ViewProps, "children"> {
  label?: string;
  helperText?: string;
  error?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  nativeID?: string;
  children: ReactNode;
}

export function FormField({
  label,
  helperText,
  error,
  isRequired = false,
  isDisabled = false,
  nativeID,
  className,
  children,
  ...viewProps
}: FormFieldProps) {
  const generatedID = useId();
  const controlID = nativeID ?? generatedID;
  const labelID = `${controlID}-label`;
  const messageID = `${controlID}-message`;
  const isInvalid = Boolean(error);
  const message = error ?? helperText;

  return (
    <View className={cn(formFieldClassName, className)} {...viewProps}>
      {label ? (
        <Label
          nativeID={labelID}
          isDisabled={isDisabled}
          isInvalid={isInvalid}
          isRequired={isRequired}
        >
          {label}
        </Label>
      ) : null}
      <FormFieldProvider
        control={{
          nativeID: controlID,
          labelledBy: label ? labelID : undefined,
          describedBy: message ? messageID : undefined,
          isInvalid,
          isDisabled,
          isRequired,
        }}
      >
        {children}
      </FormFieldProvider>
      {message ? (
        <Text
          nativeID={messageID}
          variant="caption"
          className={formFieldMessageVariants({ isInvalid })}
          accessibilityLiveRegion={isInvalid ? "polite" : "none"}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}
