import { render, renderHook, screen, waitFor } from "@testing-library/react";
import { AccessibilityInfo } from "react-native";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useReducedMotion } from "./hooks/use-reduced-motion";
import { Skeleton } from "./skeleton";
import { shouldAnimateSkeleton } from "./utils";

function mockReduceMotion(isEnabled: boolean) {
  return vi.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(isEnabled);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("When the device asks for reduced motion", () => {
  it("reports it to every caller", async () => {
    mockReduceMotion(true);

    const { result } = renderHook(() => useReducedMotion());

    await waitFor(() => expect(result.current).toBe(true));
  });

  it("stops the skeleton animating, even when the caller asked for it", async () => {
    mockReduceMotion(true);

    render(<Skeleton accessibilityLabel="Loading sitters" isAnimated />);

    await waitFor(() =>
      expect(screen.getByRole("progressbar", { name: /loading sitters/i })).toHaveStyle({
        opacity: "1",
      }),
    );
  });
});

describe("When motion is allowed", () => {
  it("animates only if the caller asked for it", () => {
    expect(shouldAnimateSkeleton({ isAnimated: true, isReducedMotion: false })).toBe(true);
    expect(shouldAnimateSkeleton({ isAnimated: false, isReducedMotion: false })).toBe(false);
    expect(shouldAnimateSkeleton({ isAnimated: true, isReducedMotion: true })).toBe(false);
    expect(shouldAnimateSkeleton({ isAnimated: false, isReducedMotion: true })).toBe(false);
  });
});

describe("When the caller disables the pulse", () => {
  it("holds the placeholder fully opaque", () => {
    render(<Skeleton accessibilityLabel="Loading sitters" isAnimated={false} />);

    expect(screen.getByRole("progressbar", { name: /loading sitters/i })).toHaveStyle({
      opacity: "1",
    });
  });
});
