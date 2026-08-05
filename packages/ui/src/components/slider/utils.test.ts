import { describe, expect, it } from "vitest";

import {
  clampRangeThumb,
  positionFromValue,
  type RangeValue,
  type SliderScale,
  snapToStep,
  valueFromPosition,
} from "./utils";

const RADIUS_SCALE: SliderScale = { min: 500, max: 50000, step: 500 };

describe("When a radius value is snapped", () => {
  it("lands on a multiple of the step measured from the minimum", () => {
    expect(snapToStep(1200, RADIUS_SCALE)).toBe(1000);
    expect(snapToStep(1300, RADIUS_SCALE)).toBe(1500);
    expect(snapToStep(24_999, RADIUS_SCALE)).toBe(25_000);
  });

  it("never leaves the bounds", () => {
    expect(snapToStep(0, RADIUS_SCALE)).toBe(500);
    expect(snapToStep(-9000, RADIUS_SCALE)).toBe(500);
    expect(snapToStep(90_000, RADIUS_SCALE)).toBe(50_000);
  });

  it("snaps to the nearest stop when the span is not a whole number of steps, and still reaches the maximum", () => {
    const coarseScale: SliderScale = { min: 0, max: 100, step: 30 };

    expect(snapToStep(99, coarseScale)).toBe(90);
    expect(snapToStep(100, coarseScale)).toBe(100);
    expect(valueFromPosition(300, 300, coarseScale)).toBe(100);
  });
});

describe("When a drag position is converted to a value", () => {
  it("snaps every position along the track to a multiple of the step, within bounds", () => {
    const trackLength = 300;

    for (let position = -20; position <= trackLength + 20; position += 7) {
      const value = valueFromPosition(position, trackLength, RADIUS_SCALE);

      expect(value).toBeGreaterThanOrEqual(RADIUS_SCALE.min);
      expect(value).toBeLessThanOrEqual(RADIUS_SCALE.max);
      expect((value - RADIUS_SCALE.min) % RADIUS_SCALE.step).toBe(0);
    }
  });

  it("maps the track ends to the scale ends", () => {
    expect(valueFromPosition(0, 300, RADIUS_SCALE)).toBe(500);
    expect(valueFromPosition(300, 300, RADIUS_SCALE)).toBe(50_000);
  });

  it("falls back to the minimum before the track has been measured", () => {
    expect(valueFromPosition(120, 0, RADIUS_SCALE)).toBe(500);
  });
});

describe("When a value is converted back to a position", () => {
  it("round-trips the track ends", () => {
    expect(positionFromValue(500, 300, RADIUS_SCALE)).toBe(0);
    expect(positionFromValue(50_000, 300, RADIUS_SCALE)).toBe(300);
  });

  it("clamps a value outside the scale onto the track", () => {
    expect(positionFromValue(90_000, 300, RADIUS_SCALE)).toBe(300);
    expect(positionFromValue(-5, 300, RADIUS_SCALE)).toBe(0);
  });
});

describe("When a range thumb is dragged", () => {
  const priceScale: SliderScale = { min: 0, max: 100, step: 5 };
  const range: RangeValue = [20, 60];

  it("clamps the lower thumb at the upper one instead of crossing it", () => {
    expect(clampRangeThumb(range, "lower", 80, priceScale)).toEqual([60, 60]);
  });

  it("clamps the upper thumb at the lower one instead of crossing it", () => {
    expect(clampRangeThumb(range, "upper", 5, priceScale)).toEqual([20, 20]);
  });

  it("keeps the tuple ascending for every position either thumb is dragged to", () => {
    for (const thumb of ["lower", "upper"] as const) {
      for (let candidate = -30; candidate <= 130; candidate += 3) {
        const [lower, upper] = clampRangeThumb(range, thumb, candidate, priceScale);

        expect(lower).toBeLessThanOrEqual(upper);
        expect(lower).toBeGreaterThanOrEqual(priceScale.min);
        expect(upper).toBeLessThanOrEqual(priceScale.max);
      }
    }
  });

  it("moves a thumb that is not crossing and snaps it to the step", () => {
    expect(clampRangeThumb(range, "lower", 33, priceScale)).toEqual([35, 60]);
    expect(clampRangeThumb(range, "upper", 82, priceScale)).toEqual([20, 80]);
  });
});
