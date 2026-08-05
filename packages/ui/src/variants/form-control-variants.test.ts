import { describe, expect, it } from "vitest";

import { MIN_TOUCH_TARGET_SIZE, touchTargetHitSlopForSize } from "../lib/touch-target";
import { checkboxBoxSize, checkboxBoxVariants } from "./checkbox-variants";
import { radioGroupIndicatorSize, radioGroupIndicatorVariants } from "./radio-group-variants";
import {
  switchThumbTravel,
  switchThumbVariants,
  switchTrackHeight,
  switchTrackVariants,
} from "./switch-variants";

const SWITCH_SIZES = ["sm", "md"] as const;

describe("When a switch track is resolved", () => {
  it("paints the on state from the primary token and the off state from muted", () => {
    expect(switchTrackVariants({ isChecked: true })).toContain("bg-primary");
    expect(switchTrackVariants({ isChecked: false })).not.toContain("bg-primary");
    expect(switchTrackVariants({ isChecked: false })).toContain("bg-muted");
  });

  it("dims only the disabled state", () => {
    expect(switchTrackVariants({ isDisabled: true })).toContain("opacity-50");
    expect(switchTrackVariants({ isDisabled: false })).not.toContain("opacity-50");
  });
});

describe("When a switch size is resolved", () => {
  it("gives the track and thumb a class for every size", () => {
    for (const size of SWITCH_SIZES) {
      expect(switchTrackVariants({ size }), size).toMatch(/h-\d+/);
      expect(switchThumbVariants({ size }), size).toMatch(/h-\d+/);
    }
  });

  it("keeps the thumb travel inside the track for every size", () => {
    for (const size of SWITCH_SIZES) {
      expect(switchThumbTravel[size], size).toBeLessThan(switchTrackHeight[size] * 2);
    }
  });
});

describe("When a form control's touch target is resolved", () => {
  it("pads every control up to the minimum touch target on both axes", () => {
    const controlSizes = [
      ...SWITCH_SIZES.map((size) => switchTrackHeight[size]),
      checkboxBoxSize,
      radioGroupIndicatorSize,
    ];

    for (const size of controlSizes) {
      const padded = size + touchTargetHitSlopForSize(size) * 2;

      expect(padded, `${size}dp resolves to ${padded}dp`).toBeGreaterThanOrEqual(
        MIN_TOUCH_TARGET_SIZE,
      );
    }
  });
});

describe("When a selection control is resolved", () => {
  it("fills the box only once something is selected", () => {
    expect(checkboxBoxVariants({ isSelected: true })).toContain("bg-primary");
    expect(checkboxBoxVariants({ isSelected: false })).not.toContain("bg-primary");
    expect(radioGroupIndicatorVariants({ isSelected: true })).toContain("border-primary");
  });

  it("marks the invalid checkbox with the destructive border", () => {
    expect(checkboxBoxVariants({ isInvalid: true })).toContain("border-destructive");
  });
});

describe("When the form control recipes are shared with the web package", () => {
  it("stays inside the React Native-safe Tailwind subset", () => {
    const everyClassString = [
      ...SWITCH_SIZES.flatMap((size) => [
        switchTrackVariants({ size }),
        switchThumbVariants({ size }),
      ]),
      checkboxBoxVariants({}),
      radioGroupIndicatorVariants({}),
    ].join(" ");

    expect(everyClassString).not.toMatch(/\bspace-[xy]-/);
    expect(everyClassString).not.toMatch(/\bdivide-/);
    expect(everyClassString).not.toMatch(/\bgrid\b/);
    expect(everyClassString).not.toMatch(/\binline-flex\b/);
  });
});
