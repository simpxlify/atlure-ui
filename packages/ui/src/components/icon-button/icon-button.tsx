import { ActivityIndicator, Pressable } from "react-native";

import { cn } from "../../lib/cn";
import { touchTargetHitSlop } from "../../lib/touch-target";
import { buttonLabelVariants, buttonVariants } from "../../variants/button-variants";
import { TextClassProvider } from "../text/text-class-context";
import type { IconButtonProps } from "../button/types";

export function IconButton({
  icon,
  accessibilityLabel,
  variant = "primary",
  isFullWidth = false,
  isDisabled = false,
  isLoading = false,
  className,
  ...pressableProps
}: IconButtonProps) {
  const isPressBlocked = isDisabled || isLoading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isPressBlocked, busy: isLoading }}
      aria-disabled={isPressBlocked}
      aria-busy={isLoading}
      disabled={isPressBlocked}
      hitSlop={touchTargetHitSlop("icon")}
      className={cn(
        buttonVariants({ variant, size: "icon", isFullWidth, isDisabled: isPressBlocked }),
        className,
      )}
      {...pressableProps}
    >
      <TextClassProvider className={buttonLabelVariants({ variant, size: "icon" })}>
        {isLoading ? <ActivityIndicator size="small" /> : icon}
      </TextClassProvider>
    </Pressable>
  );
}
