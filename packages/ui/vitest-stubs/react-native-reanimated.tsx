import { useRef, useMemo } from "react";
import { Animated, View, type ViewProps } from "react-native";

export function useSharedValue<T>(initial: T) {
  const ref = useRef({ value: initial });
  return ref.current;
}

export function useAnimatedStyle(factory: () => Record<string, unknown>) {
  return useMemo(() => factory(), [factory]);
}

export function useDerivedValue<T>(factory: () => T) {
  return { value: factory() };
}

export function withTiming<T>(target: T) {
  return target;
}

export function withSpring<T>(target: T) {
  return target;
}

export function runOnJS<A extends unknown[]>(fn: (...args: A) => void) {
  return (...args: A) => fn(...args);
}

const AnimatedView = (props: ViewProps) => <View {...props} />;

export default {
  View: AnimatedView,
  createAnimatedComponent: <P,>(Component: (props: P) => JSX.Element) => Component,
  Value: Animated.Value,
};
