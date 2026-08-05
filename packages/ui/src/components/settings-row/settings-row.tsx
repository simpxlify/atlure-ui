import { useId, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import {
  settingsRowControlClassName,
  settingsRowTextClassName,
  settingsRowVariants,
} from "../../variants/settings-row-variants";
import { Text } from "../text/text";

export interface SettingsRowProps extends ViewProps {
  title: string;
  description?: string;
  control: ReactNode;
  isDisabled?: boolean;
}

export function SettingsRow({
  title,
  description,
  control,
  isDisabled = false,
  className,
  ...viewProps
}: SettingsRowProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <View className={cn(settingsRowVariants({ isDisabled }), className)} {...viewProps}>
      <View className={settingsRowTextClassName}>
        <Text nativeID={titleId} variant="body">
          {title}
        </Text>
        {description ? (
          <Text nativeID={descriptionId} tone="muted" variant="bodySm">
            {description}
          </Text>
        ) : null}
      </View>
      <View
        accessibilityLabelledBy={titleId}
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={settingsRowControlClassName}
      >
        {control}
      </View>
    </View>
  );
}
