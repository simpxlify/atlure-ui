import { Pressable, View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import { cardVariants, type CardVariantProps } from "../../variants/card-variants";

export interface CardProps extends ViewProps, Pick<CardVariantProps, "variant"> {
  onPress?: () => void;
  accessibilityLabel?: string;
  isDisabled?: boolean;
}

export function Card({
  variant,
  onPress,
  accessibilityLabel,
  isDisabled = false,
  className,
  children,
  ...viewProps
}: CardProps) {
  const cardClassName = cn(cardVariants({ variant, isPressable: Boolean(onPress) }), className);

  if (!onPress) {
    return (
      <View className={cardClassName} {...viewProps}>
        {children}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      className={cardClassName}
      {...viewProps}
    >
      {children}
    </Pressable>
  );
}
