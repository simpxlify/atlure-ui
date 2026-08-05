import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import {
  stateActionClassName,
  stateIconClassName,
  stateLayoutClassName,
  stateTextClassName,
} from "../../variants/state-variants";
import { Text } from "../text/text";

export interface EmptyStateProps extends Omit<ViewProps, "children"> {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  ...viewProps
}: EmptyStateProps) {
  return (
    <View className={cn(stateLayoutClassName, className)} {...viewProps}>
      {icon ? <View className={stateIconClassName}>{icon}</View> : null}
      <Text accessibilityRole="header" variant="h3" className={stateTextClassName}>
        {title}
      </Text>
      {description ? (
        <Text variant="bodySm" tone="muted" className={stateTextClassName}>
          {description}
        </Text>
      ) : null}
      {action ? <View className={stateActionClassName}>{action}</View> : null}
    </View>
  );
}
