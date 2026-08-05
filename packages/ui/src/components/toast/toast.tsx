import { useMemo } from "react";
import { PanResponder, View } from "react-native";

import { cn } from "../../lib/cn";
import { toastMessageVariants, toastVariants } from "../../variants/toast-variants";
import { Text } from "../text/text";
import type { ToastVariant } from "./toast-context";
import { TOAST_SWIPE_DISMISS_DISTANCE } from "./utils";

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onDismiss: () => void;
  className?: string;
}

export function Toast({ message, variant = "default", onDismiss, className }: ToastProps) {
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) =>
          Math.abs(gesture.dx) > TOAST_SWIPE_DISMISS_DISTANCE,
        onPanResponderRelease: (_event, gesture) => {
          if (Math.abs(gesture.dx) > TOAST_SWIPE_DISMISS_DISTANCE) onDismiss();
        },
      }),
    [onDismiss],
  );

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      aria-live="polite"
      className={cn(toastVariants({ variant }), className)}
      {...panResponder.panHandlers}
    >
      <Text className={toastMessageVariants({ variant })}>{message}</Text>
    </View>
  );
}
