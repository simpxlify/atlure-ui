import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

const PULSE_DURATION_MS = 900;
const MIN_OPACITY = 0.4;
const MAX_OPACITY = 1;

export function usePulseOpacity(isEnabled: boolean): Animated.Value {
  const opacity = useRef(new Animated.Value(MAX_OPACITY)).current;

  useEffect(() => {
    if (!isEnabled) {
      opacity.setValue(MAX_OPACITY);
      return;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: MIN_OPACITY,
          duration: PULSE_DURATION_MS,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: MAX_OPACITY,
          duration: PULSE_DURATION_MS,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();

    return () => pulse.stop();
  }, [isEnabled, opacity]);

  return opacity;
}
