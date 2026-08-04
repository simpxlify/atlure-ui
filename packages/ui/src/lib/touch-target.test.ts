import { controlHeight } from "@atlure/tokens";
import { describe, expect, it } from "vitest";

import { MIN_TOUCH_TARGET_SIZE, touchTargetHitSlop } from "./touch-target";

describe("When sizing the touch target of a control", () => {
  it("pads every control scale up to the minimum touch target", () => {
    for (const [scale, height] of Object.entries(controlHeight)) {
      const paddedHeight = height + touchTargetHitSlop(scale as keyof typeof controlHeight) * 2;

      expect(paddedHeight).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
    }
  });

  it("adds no padding to a control that already meets the minimum", () => {
    expect(touchTargetHitSlop("lg")).toBe(0);
  });
});
