import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import {
  stateActionClassName,
  stateIconClassName,
  stateLayoutClassName,
  stateTextClassName,
} from "../../variants/state-variants";
import { Button } from "../button/button";
import { Text } from "../text/text";

export interface ErrorStateProps extends Omit<ViewProps, "children"> {
  title: string;
  message: string;
  retryLabel: string;
  onRetry: () => void;
  icon?: ReactNode;
}

export function ErrorState({
  title,
  message,
  retryLabel,
  onRetry,
  icon,
  className,
  ...viewProps
}: ErrorStateProps) {
  return (
    <View accessibilityRole="alert" className={cn(stateLayoutClassName, className)} {...viewProps}>
      {icon ? <View className={stateIconClassName}>{icon}</View> : null}
      <Text accessibilityRole="header" variant="h3" className={stateTextClassName}>
        {title}
      </Text>
      <Text variant="bodySm" tone="muted" className={stateTextClassName}>
        {message}
      </Text>
      <View className={stateActionClassName}>
        <Button variant="secondary" label={retryLabel} onPress={onRetry} />
      </View>
    </View>
  );
}
