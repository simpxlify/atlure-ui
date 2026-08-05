import { useCallback, useState, type ReactNode } from "react";
import {
  type AccessibilityActionEvent,
  type LayoutChangeEvent,
  Text,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { touchTargetHitSlopForSize } from "../../lib/touch-target";
import {
  SLIDER_THUMB_SIZE,
  sliderContainerClassName,
  sliderFillClassName,
  sliderLabelClassName,
  sliderThumbClassName,
  sliderTrackClassName,
} from "../../variants/slider-variants";
import type { SliderFormatLabel } from "./format-label";
import { useSliderDrag } from "./hooks/use-slider-drag";
import {
  positionFromValue,
  snapToStep,
  type SliderScale,
} from "./utils";

export interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  accessibilityLabel: string;
  formatLabel?: SliderFormatLabel;
}

export function Slider({
  min,
  max,
  step = 1,
  value,
  onValueChange,
  onValueCommit,
  accessibilityLabel,
  formatLabel,
}: SliderProps) {
  const scale: SliderScale = { min, max, step };
  const [trackLength, setTrackLength] = useState(0);
  const clampedValue = snapToStep(value, scale);
  const fillPosition = useSharedValue(0);

  const drag = useSliderDrag({
    scale,
    trackLength,
    value: clampedValue,
    onValueChange: (next) => {
      fillPosition.value = positionFromValue(next, trackLength, scale);
      onValueChange?.(next);
    },
    onValueCommit,
  });

  const onTrackLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const width = event.nativeEvent.layout.width;
      setTrackLength(width);
      fillPosition.value = positionFromValue(clampedValue, width, scale);
    },
    [clampedValue, fillPosition, scale],
  );

  const gesture = Gesture.Pan()
    .minDistance(0)
    .onStart((event) => {
      runOnJS(drag.moveTo)(event.x);
    })
    .onUpdate((event) => {
      runOnJS(drag.moveTo)(event.x);
    })
    .onEnd(() => {
      runOnJS(drag.commit)();
    })
    .onFinalize(() => {
      runOnJS(drag.commit)();
    });

  const fillStyle = useAnimatedStyle(() => ({ width: fillPosition.value }));
  const thumbStyle = useAnimatedStyle(() => ({ left: fillPosition.value }));

  const onAccessibilityAction = useCallback(
    (event: AccessibilityActionEvent) => {
      const next =
        event.nativeEvent.actionName === "increment"
          ? snapToStep(clampedValue + step, scale)
          : event.nativeEvent.actionName === "decrement"
            ? snapToStep(clampedValue - step, scale)
            : clampedValue;

      if (next === clampedValue) return;

      onValueChange?.(next);
      onValueCommit?.(next);
    },
    [clampedValue, onValueChange, onValueCommit, scale, step],
  );

  const hitSlop = touchTargetHitSlopForSize(SLIDER_THUMB_SIZE);

  return (
    <View className={sliderContainerClassName}>
      <GestureDetector gesture={gesture}>
        <View
          accessibilityRole="adjustable"
          accessibilityLabel={accessibilityLabel}
          accessibilityValue={{ min, max, now: clampedValue }}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={clampedValue}
          accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
          onAccessibilityAction={onAccessibilityAction}
          onLayout={onTrackLayout}
          className={sliderTrackClassName}
        >
          <Animated.View className={sliderFillClassName} style={fillStyle} />
          <Animated.View
            className={sliderThumbClassName}
            style={thumbStyle}
            hitSlop={{
              top: hitSlop,
              bottom: hitSlop,
              left: hitSlop,
              right: hitSlop,
            }}
          />
        </View>
      </GestureDetector>
      {formatLabel ? (
        <Text className={sliderLabelClassName}>{formatLabel(clampedValue) as ReactNode}</Text>
      ) : null}
    </View>
  );
}
