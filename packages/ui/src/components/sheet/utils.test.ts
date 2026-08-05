import { describe, expect, it } from "vitest";

import {
  resolveSnapHeights,
  resolveSnapRelease,
  SHEET_ANIMATION_DURATION,
  sheetAnimationDuration,
} from "./utils";

describe("When resolving the animation duration", () => {
  it("collapses to zero under reduced motion and keeps the slide otherwise", () => {
    expect(sheetAnimationDuration(true)).toBe(0);
    expect(sheetAnimationDuration(false)).toBe(SHEET_ANIMATION_DURATION);
  });
});

describe("When resolving snap heights", () => {
  it("turns fractions into ascending pixel heights", () => {
    expect(resolveSnapHeights([0.9, 0.5], 800)).toEqual([400, 720]);
  });

  it("clamps fractions above one and drops non-positive ones", () => {
    expect(resolveSnapHeights([1.5, 0, -0.2], 800)).toEqual([800]);
  });

  it("falls back to a half-height sheet when no usable snap point remains", () => {
    expect(resolveSnapHeights([], 800)).toEqual([400]);
  });
});

describe("When a drag is released", () => {
  const snapHeights = [400, 720];

  it("settles back to the same snap point for a small drag", () => {
    expect(resolveSnapRelease({ activeIndex: 0, dragDistance: 20, snapHeights })).toEqual({
      index: 0,
      shouldDismiss: false,
    });
  });

  it("snaps up to the taller point when dragged upwards past the midpoint", () => {
    expect(resolveSnapRelease({ activeIndex: 0, dragDistance: -200, snapHeights })).toEqual({
      index: 1,
      shouldDismiss: false,
    });
  });

  it("snaps back down to the shorter point when dragged down from the taller one", () => {
    expect(resolveSnapRelease({ activeIndex: 1, dragDistance: 250, snapHeights })).toEqual({
      index: 0,
      shouldDismiss: false,
    });
  });

  it("dismisses once the released height falls below the dismiss ratio", () => {
    expect(resolveSnapRelease({ activeIndex: 0, dragDistance: 200, snapHeights })).toEqual({
      index: 0,
      shouldDismiss: true,
    });
  });
});
