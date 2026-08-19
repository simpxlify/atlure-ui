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
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry: () => void;
  icon?: ReactNode;
  retryTestID?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  retryLabel = "Retry",
  onRetry,
  icon,
  retryTestID,
  className,
  ...viewProps
}: ErrorStateProps) {
  return (
    <View accessibilityRole="alert" className={cn(stateLayoutClassName, className)} {...viewProps}>
      {icon ? <View className={stateIconClassName}>{icon}</View> : null}
      <Text accessibilityRole="header" variant="h3" className={stateTextClassName}>
        {title}
      </Text>
      {message !== undefined ? (
        <Text variant="bodySm" tone="muted" className={stateTextClassName}>
          {message}
        </Text>
      ) : null}
      <View className={stateActionClassName}>
        <Button variant="secondary" label={retryLabel} onPress={onRetry} testID={retryTestID} />
      </View>
    </View>
  );
}
