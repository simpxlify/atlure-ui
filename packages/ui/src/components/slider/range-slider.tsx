import { useCallback, useRef, useState } from "react";
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
import type { RangeSliderFormatLabel } from "./format-label";
import {
  clampRangeThumb,
  positionFromValue,
  type RangeThumb,
  type RangeValue,
  type SliderScale,
  valueFromPosition,
} from "./utils";

export interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: RangeValue;
  onValueChange?: (value: RangeValue) => void;
  onValueCommit?: (value: RangeValue) => void;
  accessibilityLabel: string;
  formatLabel?: RangeSliderFormatLabel;
}

export function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onValueChange,
  onValueCommit,
  accessibilityLabel,
  formatLabel,
}: RangeSliderProps) {
  const scale: SliderScale = { min, max, step };
  const [trackLength, setTrackLength] = useState(0);
  const lowerPosition = useSharedValue(0);
  const upperPosition = useSharedValue(0);
  const draggedRangeRef = useRef<RangeValue | null>(null);

  const emitChange = useCallback(
    (next: RangeValue) => {
      draggedRangeRef.current = next;
      lowerPosition.value = positionFromValue(next[0], trackLength, scale);
      upperPosition.value = positionFromValue(next[1], trackLength, scale);
      onValueChange?.(next);
    },
    [lowerPosition, upperPosition, onValueChange, scale, trackLength],
  );

  const moveThumb = useCallback(
    (thumb: RangeThumb, position: number) => {
      const candidate = valueFromPosition(position, trackLength, scale);
      const current = draggedRangeRef.current ?? value;
      const next = clampRangeThumb(current, thumb, candidate, scale);
      emitChange(next);
    },
    [emitChange, scale, trackLength, value],
  );

  const commit = useCallback(() => {
    const committed = draggedRangeRef.current ?? value;
    draggedRangeRef.current = null;
    onValueCommit?.(committed);
  }, [onValueCommit, value]);

  const onTrackLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const width = event.nativeEvent.layout.width;
      setTrackLength(width);
      lowerPosition.value = positionFromValue(value[0], width, scale);
      upperPosition.value = positionFromValue(value[1], width, scale);
    },
    [lowerPosition, upperPosition, scale, value],
  );

  const buildGesture = (thumb: RangeThumb) =>
    Gesture.Pan()
      .minDistance(0)
      .onStart((event) => {
        runOnJS(moveThumb)(thumb, event.x);
      })
      .onUpdate((event) => {
        runOnJS(moveThumb)(thumb, event.x);
      })
      .onEnd(() => {
        runOnJS(commit)();
      })
      .onFinalize(() => {
        runOnJS(commit)();
      });

  const lowerGesture = buildGesture("lower");
  const upperGesture = buildGesture("upper");

  const fillStyle = useAnimatedStyle(() => ({
    left: lowerPosition.value,
    width: Math.max(0, upperPosition.value - lowerPosition.value),
  }));
  const lowerThumbStyle = useAnimatedStyle(() => ({ left: lowerPosition.value }));
  const upperThumbStyle = useAnimatedStyle(() => ({ left: upperPosition.value }));

  const hitSlop = touchTargetHitSlopForSize(SLIDER_THUMB_SIZE);
  const slopStyle = {
    top: hitSlop,
    bottom: hitSlop,
    left: hitSlop,
    right: hitSlop,
  };

  const adjust = useCallback(
    (thumb: RangeThumb, actionName: string) => {
      const [lower, upper] = value;
      const delta = actionName === "increment" ? step : -step;
      const candidate = (thumb === "lower" ? lower : upper) + delta;
      const next = clampRangeThumb(value, thumb, candidate, scale);
      if (next[0] === lower && next[1] === upper) return;
      onValueChange?.(next);
      onValueCommit?.(next);
    },
    [onValueChange, onValueCommit, scale, step, value],
  );

  const onLowerAction = useCallback(
    (event: AccessibilityActionEvent) => adjust("lower", event.nativeEvent.actionName),
    [adjust],
  );
  const onUpperAction = useCallback(
    (event: AccessibilityActionEvent) => adjust("upper", event.nativeEvent.actionName),
    [adjust],
  );

  return (
    <View className={sliderContainerClassName}>
      <View
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ min, max, now: value[1] }}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value[1]}
        onLayout={onTrackLayout}
        className={sliderTrackClassName}
      >
        <Animated.View className={sliderFillClassName} style={fillStyle} />
        <GestureDetector gesture={lowerGesture}>
          <Animated.View
            accessibilityRole="adjustable"
            accessibilityLabel={`${accessibilityLabel} lower bound`}
            accessibilityValue={{ min, max: value[1], now: value[0] }}
            aria-valuemin={min}
            aria-valuemax={value[1]}
            aria-valuenow={value[0]}
            accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
            onAccessibilityAction={onLowerAction}
            className={sliderThumbClassName}
            style={lowerThumbStyle}
            hitSlop={slopStyle}
          />
        </GestureDetector>
        <GestureDetector gesture={upperGesture}>
          <Animated.View
            accessibilityRole="adjustable"
            accessibilityLabel={`${accessibilityLabel} upper bound`}
            accessibilityValue={{ min: value[0], max, now: value[1] }}
            aria-valuemin={value[0]}
            aria-valuemax={max}
            aria-valuenow={value[1]}
            accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
            onAccessibilityAction={onUpperAction}
            className={sliderThumbClassName}
            style={upperThumbStyle}
            hitSlop={slopStyle}
          />
        </GestureDetector>
      </View>
      {formatLabel ? (
        <Text className={sliderLabelClassName}>
          {`${formatLabel(value[0], "lower")} - ${formatLabel(value[1], "upper")}`}
        </Text>
      ) : null}
    </View>
  );
}
