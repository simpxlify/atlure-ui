import { ActivityIndicator, Pressable } from "react-native";

import { cn } from "../../lib/cn";
import { touchTargetHitSlop } from "../../lib/touch-target";
import { buttonLabelVariants, buttonVariants } from "../../variants/button-variants";
import { Text } from "../text/text";
import type { ButtonProps } from "./types";

export function Button({
  label,
  variant = "primary",
  size = "md",
  isFullWidth = false,
  isDisabled = false,
  isLoading = false,
  leadingIcon,
  trailingIcon,
  accessibilityLabel,
  className,
  labelClassName,
  ...pressableProps
}: ButtonProps) {
  const isPressBlocked = isDisabled || isLoading;
  const hasAdornment = Boolean(leadingIcon ?? trailingIcon) || isLoading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isPressBlocked, busy: isLoading }}
      disabled={isPressBlocked}
      hitSlop={touchTargetHitSlop(size)}
      className={cn(
        buttonVariants({ variant, size, isFullWidth, isDisabled: isPressBlocked }),
        hasAdornment && "gap-sm",
        className,
      )}
      {...pressableProps}
    >
      {isLoading ? <ActivityIndicator size="small" /> : leadingIcon}
      <Text className={cn(buttonLabelVariants({ variant, size }), labelClassName)}>{label}</Text>
      {!isLoading && trailingIcon}
    </Pressable>
  );
}
