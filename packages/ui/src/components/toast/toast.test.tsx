import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { AccessibilityInfo } from "react-native";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PortalHost } from "../../lib/portal";
import { useToast } from "../../lib/use-toast";
import { Button } from "../button/button";
import { ToastProvider } from "./toast-provider";
import { TOAST_DEFAULT_DURATION } from "./utils";

function ToastTrigger({ message, duration }: { message: string; duration?: number }) {
  const { show } = useToast();

  return <Button label={`Show ${message}`} onPress={() => show({ message, duration })} />;
}

function renderWithProvider(ui: ReactNode) {
  return render(
    <PortalHost>
      <ToastProvider>{ui}</ToastProvider>
    </PortalHost>,
  );
}

function showToast(message: string) {
  act(() => {
    fireEvent.click(screen.getByRole("button", { name: `Show ${message}` }));
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(AccessibilityInfo, "announceForAccessibility").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("When a toast is shown", () => {
  it("announces it to screen readers and dismisses it after its own duration", () => {
    renderWithProvider(<ToastTrigger message="Booking confirmed" duration={3000} />);

    showToast("Booking confirmed");

    expect(screen.getByRole("alert")).toHaveTextContent("Booking confirmed");
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith("Booking confirmed");

    act(() => {
      vi.advanceTimersByTime(2999);
    });

    expect(screen.queryByRole("alert")).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("falls back to the default duration when none is given", () => {
    renderWithProvider(<ToastTrigger message="Saved" />);

    showToast("Saved");

    act(() => {
      vi.advanceTimersByTime(TOAST_DEFAULT_DURATION - 1);
    });

    expect(screen.queryByRole("alert")).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.queryByRole("alert")).toBeNull();
  });
});

describe("When two toasts are shown", () => {
  it("queues the second behind the first rather than stacking them", () => {
    renderWithProvider(
      <>
        <ToastTrigger message="First" duration={1000} />
        <ToastTrigger message="Second" duration={1000} />
      </>,
    );

    showToast("First");
    showToast("Second");

    expect(screen.getAllByRole("alert")).toHaveLength(1);
    expect(screen.getByRole("alert")).toHaveTextContent("First");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getAllByRole("alert")).toHaveLength(1);
    expect(screen.getByRole("alert")).toHaveTextContent("Second");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByRole("alert")).toBeNull();
  });
});

describe("When no toast provider is mounted", () => {
  it("throws an error naming ToastProvider", () => {
    expect(() => render(<ToastTrigger message="Orphan" />)).toThrowError(/<ToastProvider>/);
  });
});
