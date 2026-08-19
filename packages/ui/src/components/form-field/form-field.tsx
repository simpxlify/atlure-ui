import { useId, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import { formFieldClassName, formFieldMessageVariants } from "../../variants/form-field-variants";
import { Input, type InputProps } from "../input/input";
import { Label } from "../label/label";
import { Text } from "../text/text";
import { FormFieldProvider } from "./form-field-context";

interface FormFieldSharedProps {
  label?: string;
  helperText?: string;
  error?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  nativeID?: string;
}

export interface FormFieldContainerProps
  extends FormFieldSharedProps,
    Omit<ViewProps, "children"> {
  variant?: "container";
  children: ReactNode;
}

export interface FormFieldInlineProps extends FormFieldSharedProps, Omit<InputProps, "children"> {
  variant: "inline";
  inputClassName?: string;
  wrapperClassName?: string;
}

export type FormFieldProps = FormFieldContainerProps | FormFieldInlineProps;

export function FormField(props: FormFieldProps) {
  const {
    label,
    helperText,
    error,
    isRequired = false,
    isDisabled = false,
    nativeID,
  } = props;

  const generatedID = useId();
  const controlID = nativeID ?? generatedID;
  const labelID = `${controlID}-label`;
  const messageID = `${controlID}-message`;
  const isInvalid = Boolean(error);
  const message = error ?? helperText;

  const wrapperClassName =
    props.variant === "inline" ? props.wrapperClassName : props.className;
  const outerViewProps = props.variant === "inline" ? undefined : extractOuterViewProps(props);

  const providedChildren =
    props.variant === "inline" ? renderInline(props) : props.children;

  return (
    <View className={cn(formFieldClassName, wrapperClassName)} {...outerViewProps}>
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
        {providedChildren}
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

const SHARED_KEYS = new Set([
  "label",
  "helperText",
  "error",
  "isRequired",
  "isDisabled",
  "nativeID",
  "variant",
  "children",
  "className",
]);

function extractOuterViewProps(props: FormFieldContainerProps): Omit<ViewProps, "className"> {
  const viewProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!SHARED_KEYS.has(key)) {
      viewProps[key] = value;
    }
  }
  return viewProps as Omit<ViewProps, "className">;
}

function renderInline(props: FormFieldInlineProps) {
  const { inputClassName, ...rest } = props;
  const inputProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (!SHARED_KEYS.has(key) && key !== "wrapperClassName") {
      inputProps[key] = value;
    }
  }
  return <Input className={inputClassName} {...(inputProps as InputProps)} />;
}
