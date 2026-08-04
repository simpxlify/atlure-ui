import { Text as ReactNativeText, type TextProps as ReactNativeTextProps } from "react-native";

import { cn } from "../../lib/cn";
import { textVariants, type TextVariantProps } from "../../variants/text-variants";

export interface TextProps extends ReactNativeTextProps, TextVariantProps {}

export function Text({ variant, tone, className, ...textProps }: TextProps) {
  return (
    <ReactNativeText className={cn(textVariants({ variant, tone }), className)} {...textProps} />
  );
}
