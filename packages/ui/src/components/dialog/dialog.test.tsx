import { act, fireEvent, render, screen } from "@testing-library/react";
import { type ReactNode, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { PortalHost } from "../../lib/portal";
import { buttonVariants } from "../../variants/button-variants";
import { AlertDialog } from "../alert-dialog/alert-dialog";
import { alertDialogConfirmVariant } from "../alert-dialog/utils";
import { Dialog, DialogHeader, DialogTitle } from "./dialog";

const mockAddEventListener = vi.fn(() => ({ remove: vi.fn() }));

vi.mock("react-native", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-native")>();

  return {
    ...actual,
    Platform: { ...actual.Platform, OS: "android" },
    BackHandler: {
      ...actual.BackHandler,
      addEventListener: (...args: unknown[]) => mockAddEventListener(...(args as [])),
    },
  };
});

function renderInHost(ui: ReactNode) {
  return render(<PortalHost>{ui}</PortalHost>);
}

describe("When a dialog is open", () => {
  it("closes on a backdrop press", () => {
    const onClose = vi.fn();

    renderInHost(
      <Dialog isOpen onClose={onClose} backdropAccessibilityLabel="Dismiss">
        <DialogHeader>
          <DialogTitle>Delete Rex</DialogTitle>
        </DialogHeader>
      </Dialog>,
    );

    expect(screen.getByRole("heading", { name: "Delete Rex" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on the Android hardware back button", () => {
    const onClose = vi.fn();
    mockAddEventListener.mockClear();

    renderInHost(
      <Dialog isOpen onClose={onClose} backdropAccessibilityLabel="Dismiss">
        <DialogTitle>Delete Rex</DialogTitle>
      </Dialog>,
    );

    const [, handleHardwareBack] = mockAddEventListener.mock.calls[0] as unknown as [
      string,
      () => boolean,
    ];

    expect(handleHardwareBack()).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("When an alert dialog is open", () => {
  it("offers no backdrop affordance to dismiss with, only the two actions", () => {
    renderInHost(
      <AlertDialog
        isOpen
        title="Cancel booking"
        confirmLabel="Confirm"
        cancelLabel="Keep booking"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getAllByRole("button").map((button) => button.textContent)).toEqual([
      "Keep booking",
      "Confirm",
    ]);
  });

  it("does not register a hardware back handler", () => {
    mockAddEventListener.mockClear();

    renderInHost(
      <AlertDialog
        isOpen
        title="Cancel booking"
        confirmLabel="Confirm"
        cancelLabel="Keep"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(mockAddEventListener).not.toHaveBeenCalled();
  });

  it("confirms exactly once and cancels exactly once", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    renderInHost(
      <AlertDialog
        isOpen
        isDestructive
        title="Delete Rex"
        description="This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    expect(screen.getByText("This cannot be undone.")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.click(screen.getByRole("button", { name: "Keep" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

describe("When an alert dialog confirm action is resolved", () => {
  it("paints a destructive confirm from the destructive token and a plain one from primary", () => {
    expect(alertDialogConfirmVariant(true)).toBe("destructive");
    expect(alertDialogConfirmVariant(false)).toBe("primary");
    expect(buttonVariants({ variant: alertDialogConfirmVariant(true) })).toContain("bg-destructive");
    expect(buttonVariants({ variant: alertDialogConfirmVariant(false) })).toContain("bg-primary");
  });
});

function TwoDialogs() {
  const [isFirstOpen, setIsFirstOpen] = useState(true);

  return (
    <PortalHost>
      <Dialog
        isOpen={isFirstOpen}
        onClose={() => setIsFirstOpen(false)}
        backdropAccessibilityLabel="Dismiss first"
      >
        <DialogTitle>First dialog</DialogTitle>
      </Dialog>
      <Dialog isOpen onClose={vi.fn()} backdropAccessibilityLabel="Dismiss second">
        <DialogTitle>Second dialog</DialogTitle>
      </Dialog>
    </PortalHost>
  );
}

describe("When two dialogs are open at once", () => {
  it("shows the first only, then the second once the first closes", () => {
    render(<TwoDialogs />);

    expect(screen.getByRole("heading", { name: "First dialog" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Second dialog" })).toBeNull();

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Dismiss first" }));
    });

    expect(screen.queryByRole("heading", { name: "First dialog" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Second dialog" })).toBeTruthy();
  });
});

describe("When no portal host is mounted", () => {
  it("throws an error naming PortalHost", () => {
    expect(() =>
      render(
        <Dialog isOpen onClose={vi.fn()} backdropAccessibilityLabel="Dismiss">
          <DialogTitle>Orphan</DialogTitle>
        </Dialog>,
      ),
    ).toThrowError(/<PortalHost>/);
  });
});
