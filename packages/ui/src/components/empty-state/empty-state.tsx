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

export type EmptyStatePreset = "no-results" | "no-filters" | "no-radius";

export interface EmptyStateCopy {
  title: string;
  message: string;
  actionLabel: string;
}

export const DEFAULT_EMPTY_STATE_COPY: Record<EmptyStatePreset, EmptyStateCopy> = {
  "no-results": {
    title: "No matches",
    message: "Nothing matched your query.",
    actionLabel: "Clear search",
  },
  "no-filters": {
    title: "No matches",
    message: "Try loosening your filters.",
    actionLabel: "Clear filters",
  },
  "no-radius": {
    title: "Nobody nearby",
    message: "Try a wider radius.",
    actionLabel: "Widen radius",
  },
};

export interface EmptyStateProps extends Omit<ViewProps, "children"> {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  preset?: EmptyStatePreset;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  preset,
  className,
  ...viewProps
}: EmptyStateProps) {
  const copy = preset ? DEFAULT_EMPTY_STATE_COPY[preset] : undefined;
  const resolvedTitle = title ?? copy?.title ?? "";
  const resolvedDescription = description ?? copy?.message;

  return (
    <View className={cn(stateLayoutClassName, className)} {...viewProps}>
      {icon ? <View className={stateIconClassName}>{icon}</View> : null}
      <Text accessibilityRole="header" variant="h3" className={stateTextClassName}>
        {resolvedTitle}
      </Text>
      {resolvedDescription ? (
        <Text variant="bodySm" tone="muted" className={stateTextClassName}>
          {resolvedDescription}
        </Text>
      ) : null}
      {action ? <View className={stateActionClassName}>{action}</View> : null}
    </View>
  );
}
