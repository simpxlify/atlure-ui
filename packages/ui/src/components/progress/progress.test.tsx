import { act, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { AccessibilityInfo, Animated } from "react-native";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Progress } from "./progress";
import { clampProgress } from "./utils";

async function renderProgress(ui: ReactElement) {
  await act(async () => {
    render(ui);
  });
}

function stubLoopedAnimation() {
  const animation = { start: vi.fn(), stop: vi.fn(), reset: vi.fn() };

  vi.spyOn(Animated, "loop").mockReturnValue(
    animation as unknown as ReturnType<typeof Animated.loop>,
  );

  return animation;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("When progress is determinate", () => {
  it("reports its bounds and current value to screen readers", async () => {
    await renderProgress(<Progress value={42} accessibilityLabel="Walk progress" />);

    const bar = screen.getByRole("progressbar", { name: "Walk progress" });

    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-valuenow", "42");
    expect(bar).toHaveAttribute("aria-busy", "false");
  });

  it("clamps a value outside the bounds rather than overflowing the track", async () => {
    await renderProgress(<Progress value={140} accessibilityLabel="Walk progress" />);

    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("clamps a negative value to zero", async () => {
    await renderProgress(<Progress value={-20} accessibilityLabel="Walk progress" />);

    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });
});

describe("When progress is indeterminate", () => {
  it("announces itself as busy and reports no current value", async () => {
    await renderProgress(<Progress isIndeterminate accessibilityLabel="Uploading" />);

    const bar = screen.getByRole("progressbar", { name: "Uploading" });

    expect(bar).toHaveAttribute("aria-busy", "true");
    expect(bar).not.toHaveAttribute("aria-valuenow");
  });

  it("keeps a looping animation running when reduced motion is off", async () => {
    vi.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false);
    const animation = stubLoopedAnimation();

    await renderProgress(<Progress isIndeterminate accessibilityLabel="Uploading" />);

    expect(animation.start).toHaveBeenCalled();
    expect(animation.stop).not.toHaveBeenCalled();
  });

  it("stops the animation once reduced motion is known to be on", async () => {
    vi.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(true);
    const animation = stubLoopedAnimation();

    await renderProgress(<Progress isIndeterminate accessibilityLabel="Uploading" />);

    expect(animation.stop).toHaveBeenCalled();
  });

  it("never animates a determinate bar", async () => {
    const animation = stubLoopedAnimation();

    await renderProgress(<Progress value={30} accessibilityLabel="Walk progress" />);

    expect(animation.start).not.toHaveBeenCalled();
  });
});

describe("When a progress value is clamped", () => {
  it("keeps values inside nought to a hundred and treats NaN as nought", () => {
    expect(clampProgress(0)).toBe(0);
    expect(clampProgress(55.5)).toBe(55.5);
    expect(clampProgress(100)).toBe(100);
    expect(clampProgress(101)).toBe(100);
    expect(clampProgress(-1)).toBe(0);
    expect(clampProgress(Number.NaN)).toBe(0);
  });
});
