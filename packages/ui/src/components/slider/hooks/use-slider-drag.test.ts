import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { SliderScale } from "../utils";
import { useSliderDrag } from "./use-slider-drag";

const RADIUS_SCALE: SliderScale = { min: 500, max: 50000, step: 500 };
const TRACK_LENGTH = 300;

function renderDrag(scale: SliderScale = RADIUS_SCALE) {
  const onValueChange = vi.fn();
  const onValueCommit = vi.fn();

  const { result } = renderHook(() =>
    useSliderDrag({
      scale,
      trackLength: TRACK_LENGTH,
      value: scale.min,
      onValueChange,
      onValueCommit,
    }),
  );

  return { result, onValueChange, onValueCommit };
}

describe("When a drag moves across the track", () => {
  it("reports a stepped, in-bounds value on every move", () => {
    const { result, onValueChange } = renderDrag();

    act(() => {
      for (let position = 0; position <= TRACK_LENGTH; position += 30) {
        result.current.moveTo(position);
      }
    });

    expect(onValueChange).toHaveBeenCalledTimes(11);

    for (const [reported] of onValueChange.mock.calls as [number][]) {
      expect(reported).toBeGreaterThanOrEqual(RADIUS_SCALE.min);
      expect(reported).toBeLessThanOrEqual(RADIUS_SCALE.max);
      expect((reported - RADIUS_SCALE.min) % RADIUS_SCALE.step).toBe(0);
    }
  });

  it("stays in bounds when dragged beyond either end of the track", () => {
    const { result, onValueChange } = renderDrag();

    act(() => {
      result.current.moveTo(-500);
      result.current.moveTo(TRACK_LENGTH + 500);
    });

    expect(onValueChange.mock.calls.map(([reported]) => reported)).toEqual([500, 50_000]);
  });
});

describe("When a drag is released", () => {
  it("commits exactly once for a drag that reported ten changes", () => {
    const { result, onValueChange, onValueCommit } = renderDrag();

    act(() => {
      for (let move = 1; move <= 10; move += 1) {
        result.current.moveTo(move * 30);
      }
      result.current.commit();
    });

    expect(onValueChange).toHaveBeenCalledTimes(10);
    expect(onValueCommit).toHaveBeenCalledTimes(1);
  });

  it("commits the value the drag ended on", () => {
    const { result, onValueChange, onValueCommit } = renderDrag();

    act(() => {
      result.current.moveTo(TRACK_LENGTH / 2);
      result.current.moveTo(TRACK_LENGTH);
      result.current.commit();
    });

    const lastReported = onValueChange.mock.lastCall?.[0];

    expect(onValueCommit).toHaveBeenCalledExactlyOnceWith(lastReported);
    expect(onValueCommit).toHaveBeenCalledWith(50_000);
  });

  it("commits the current value when released without any movement", () => {
    const { result, onValueCommit } = renderDrag();

    act(() => {
      result.current.commit();
    });

    expect(onValueCommit).toHaveBeenCalledExactlyOnceWith(RADIUS_SCALE.min);
  });

  it("does not replay the previous drag's value on a later release", () => {
    const { result, onValueCommit } = renderDrag();

    act(() => {
      result.current.moveTo(TRACK_LENGTH);
      result.current.commit();
    });

    act(() => {
      result.current.commit();
    });

    expect(onValueCommit.mock.calls.map(([committed]) => committed)).toEqual([50_000, 500]);
  });
});
