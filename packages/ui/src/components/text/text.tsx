import type { ComponentRef, Ref } from "react";
import { Text as ReactNativeText, type TextProps as ReactNativeTextProps } from "react-native";

import type { TextVariantProps } from "../../variants/text-variants";
import { useInheritedTextClassName } from "./text-class-context";
import { resolveTextClassName } from "./utils";

export interface TextProps extends ReactNativeTextProps, TextVariantProps {
  ref?: Ref<ComponentRef<typeof ReactNativeText>>;
}

export function Text({ variant, tone, className, ...textProps }: TextProps) {
  const inheritedClassName = useInheritedTextClassName();

  return (
    <ReactNativeText
      className={resolveTextClassName({ variant, tone, inheritedClassName, className })}
      {...textProps}
    />
  );
}
