import { useEffect, useRef } from "react";
import { Animated, Easing, View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import {
  progressFillClassName,
  progressTrackVariants,
  type ProgressVariantProps,
} from "../../variants/progress-variants";
import { useReducedMotion } from "../skeleton/hooks/use-reduced-motion";
import {
  clampProgress,
  PROGRESS_INDETERMINATE_DURATION,
  PROGRESS_INDETERMINATE_WIDTH_RATIO,
  PROGRESS_MAX,
  PROGRESS_MIN,
} from "./utils";

export interface ProgressProps extends Omit<ViewProps, "children"> {
  value?: number;
  isIndeterminate?: boolean;
  size?: NonNullable<ProgressVariantProps["size"]>;
  accessibilityLabel: string;
}

export function Progress({
  value = 0,
  isIndeterminate = false,
  size = "md",
  accessibilityLabel,
  className,
  ...viewProps
}: ProgressProps) {
  const isReducedMotion = useReducedMotion();
  const slide = useRef(new Animated.Value(0)).current;
  const isAnimated = isIndeterminate && !isReducedMotion;

  useEffect(() => {
    if (!isAnimated) return;

    slide.setValue(0);
    const animation = Animated.loop(
      Animated.timing(slide, {
        toValue: 1,
        duration: PROGRESS_INDETERMINATE_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => animation.stop();
  }, [isAnimated, slide]);

  const clampedValue = clampProgress(value);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={
        isIndeterminate
          ? undefined
          : { min: PROGRESS_MIN, max: PROGRESS_MAX, now: clampedValue }
      }
      accessibilityState={{ busy: isIndeterminate }}
      aria-busy={isIndeterminate}
      aria-valuemin={isIndeterminate ? undefined : PROGRESS_MIN}
      aria-valuemax={isIndeterminate ? undefined : PROGRESS_MAX}
      aria-valuenow={isIndeterminate ? undefined : clampedValue}
      className={cn(progressTrackVariants({ size }), className)}
      {...viewProps}
    >
      {isIndeterminate ? (
        <Animated.View
          className={progressFillClassName}
          style={{
            width: `${PROGRESS_INDETERMINATE_WIDTH_RATIO * PROGRESS_MAX}%`,
            transform: [
              {
                translateX: slide.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", `${PROGRESS_MAX / PROGRESS_INDETERMINATE_WIDTH_RATIO}%`],
                }),
              },
            ],
          }}
        />
      ) : (
        <View className={progressFillClassName} style={{ width: `${clampedValue}%` }} />
      )}
    </View>
  );
}
