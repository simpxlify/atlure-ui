import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, type ScrollViewProps } from "react-native";

import { cn } from "../../lib/cn";
import {
  formScrollViewClassName,
  formScrollViewContentClassName,
} from "../../variants/form-scroll-view-variants";

export interface FormScrollViewProps extends Omit<ScrollViewProps, "children"> {
  contentContainerClassName?: string;
  children: ReactNode;
}

export function FormScrollView({
  className,
  contentContainerClassName,
  children,
  ...scrollViewProps
}: FormScrollViewProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className={cn(formScrollViewClassName, className)}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerClassName={cn(formScrollViewContentClassName, contentContainerClassName)}
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
