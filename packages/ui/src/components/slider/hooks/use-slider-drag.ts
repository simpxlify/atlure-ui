import { useCallback, useRef } from "react";

import { type SliderScale, valueFromPosition } from "../utils";

export interface SliderDragOptions {
  scale: SliderScale;
  trackLength: number;
  value: number;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
}

export interface SliderDrag {
  moveTo: (position: number) => number;
  commit: () => number;
}

export function useSliderDrag({
  scale,
  trackLength,
  value,
  onValueChange,
  onValueCommit,
}: SliderDragOptions): SliderDrag {
  const draggedValueRef = useRef<number | null>(null);

  const moveTo = useCallback(
    (position: number) => {
      const nextValue = valueFromPosition(position, trackLength, scale);
      draggedValueRef.current = nextValue;
      onValueChange?.(nextValue);

      return nextValue;
    },
    [trackLength, scale, onValueChange],
  );

  const commit = useCallback(() => {
    const committedValue = draggedValueRef.current ?? value;
    draggedValueRef.current = null;
    onValueCommit?.(committedValue);

    return committedValue;
  }, [value, onValueCommit]);

  return { moveTo, commit };
}
