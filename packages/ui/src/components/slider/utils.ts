export interface SliderScale {
  min: number;
  max: number;
  step: number;
}

export type RangeValue = readonly [number, number];
export type RangeThumb = "lower" | "upper";

export function snapToStep(value: number, { min, max, step }: SliderScale): number {
  if (Number.isNaN(value)) return min;
  if (value <= min) return min;
  if (value >= max) return max;
  if (step <= 0) return value;

  const snapped = min + Math.round((value - min) / step) * step;

  return Math.min(Math.max(snapped, min), max);
}

export function valueFromPosition(
  position: number,
  trackLength: number,
  scale: SliderScale,
): number {
  if (trackLength <= 0) return scale.min;

  const ratio = Math.min(Math.max(position / trackLength, 0), 1);

  return snapToStep(scale.min + ratio * (scale.max - scale.min), scale);
}

export function positionFromValue(
  value: number,
  trackLength: number,
  { min, max }: SliderScale,
): number {
  if (max === min) return 0;

  const ratio = (Math.min(Math.max(value, min), max) - min) / (max - min);

  return ratio * trackLength;
}

export function clampRangeThumb(
  range: RangeValue,
  thumb: RangeThumb,
  candidate: number,
  scale: SliderScale,
): RangeValue {
  const snapped = snapToStep(candidate, scale);
  const [lower, upper] = range;

  return thumb === "lower"
    ? [Math.min(snapped, upper), upper]
    : [lower, Math.max(snapped, lower)];
}
