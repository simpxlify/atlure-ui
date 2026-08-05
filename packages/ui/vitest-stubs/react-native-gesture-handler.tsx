import type { ReactElement, ReactNode } from "react";
import { View, type ViewProps } from "react-native";

type PanCallback = (event: {
  translationX: number;
  translationY: number;
  x: number;
  y: number;
  absoluteX: number;
  absoluteY: number;
}) => void;

class PanBuilder {
  onStart(_cb: PanCallback) {
    return this;
  }
  onUpdate(_cb: PanCallback) {
    return this;
  }
  onEnd(_cb: PanCallback) {
    return this;
  }
  onFinalize(_cb: PanCallback) {
    return this;
  }
  minDistance(_value: number) {
    return this;
  }
  activeOffsetX(_value: number | number[]) {
    return this;
  }
}

export const Gesture = {
  Pan: () => new PanBuilder(),
};

export function GestureDetector({ children }: { children: ReactNode; gesture: unknown }) {
  return children as ReactElement;
}

export function GestureHandlerRootView(props: ViewProps) {
  return <View {...props} />;
}
