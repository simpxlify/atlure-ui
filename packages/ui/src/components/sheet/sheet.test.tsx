import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AccessibilityInfo, Animated } from "react-native";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Sheet } from "./sheet";
import { SHEET_ANIMATION_DURATION } from "./utils";

const mockAddEventListener = vi.fn();

vi.mock("react-native", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-native")>();

  return {
    ...actual,
    Platform: { ...actual.Platform, OS: "android" },
    BackHandler: {
      ...actual.BackHandler,
      addEventListener: (...args: unknown[]) => mockAddEventListener(...args),
    },
  };
});

async function renderSheet({ isOpen, onClose = vi.fn() }: { isOpen: boolean; onClose?: () => void }) {
  await act(async () => {
    render(
      <Sheet
        isOpen={isOpen}
        onClose={onClose}
        backdropAccessibilityLabel="Close"
        accessibilityLabel="Species"
      >
        <span>Sheet body</span>
      </Sheet>,
    );
  });

  return onClose;
}

beforeEach(() => {
  mockAddEventListener.mockReturnValue({ remove: vi.fn() });
});

afterEach(() => {
  vi.restoreAllMocks();
  mockAddEventListener.mockReset();
});

describe("When a sheet is closed", () => {
  it("renders none of its children", async () => {
    await renderSheet({ isOpen: false });

    expect(screen.queryByText("Sheet body")).toBeNull();
  });
});

describe("When a sheet is open", () => {
  it("renders its children and closes exactly once on a backdrop press", async () => {
    const onClose = await renderSheet({ isOpen: true });

    expect(screen.getByText("Sheet body")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("When the Android hardware back button is pressed", () => {
  it("closes the sheet and marks the event handled", async () => {
    const onClose = await renderSheet({ isOpen: true });

    expect(mockAddEventListener).toHaveBeenCalledWith("hardwareBackPress", expect.any(Function));

    const [, handleHardwareBack] = mockAddEventListener.mock.calls[0] as [
      string,
      () => boolean | null | undefined,
    ];

    expect(handleHardwareBack()).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("subscribes only while the sheet is open", async () => {
    await renderSheet({ isOpen: false });

    expect(mockAddEventListener).not.toHaveBeenCalled();
  });
});

describe("When the reduced-motion setting is on", () => {
  it("animates with a duration of zero", async () => {
    vi.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(true);
    const timing = vi.spyOn(Animated, "timing");

    await renderSheet({ isOpen: true });

    await waitFor(() => {
      expect(timing).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ duration: 0 }),
      );
    });
  });

  it("keeps the slide animation when reduced motion is off", async () => {
    vi.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false);
    const timing = vi.spyOn(Animated, "timing");

    await renderSheet({ isOpen: true });

    await waitFor(() => {
      expect(timing).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ duration: SHEET_ANIMATION_DURATION }),
      );
    });
  });
});
