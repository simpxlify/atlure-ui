import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { press } from "../../../test-utils/press";
import { Button } from "./button";

const onPress = vi.fn();

describe("When a button is pressed", () => {
  it("notifies the caller", () => {
    onPress.mockReset();
    render(<Button label="Book a sitter" onPress={onPress} />);

    press(screen.getByRole("button", { name: /book a sitter/i }));

    expect(onPress).toHaveBeenCalled();
  });
});

describe("When a button is disabled", () => {
  it("ignores presses and exposes the disabled state", () => {
    onPress.mockReset();
    render(<Button label="Book a sitter" isDisabled onPress={onPress} />);

    const button = screen.getByRole("button", { name: /book a sitter/i });
    press(button);

    expect(onPress).not.toHaveBeenCalled();
    expect(button).toHaveAttribute("aria-disabled", "true");
  });
});

describe("When a button is loading", () => {
  it("ignores presses and announces itself as busy", () => {
    onPress.mockReset();
    render(<Button label="Book a sitter" isLoading onPress={onPress} />);

    const button = screen.getByRole("button", { name: /book a sitter/i });
    press(button);

    expect(onPress).not.toHaveBeenCalled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });
});

describe("When a button carries a separate accessibility label", () => {
  it("announces the accessibility label instead of the visible one", () => {
    render(<Button label="Book" accessibilityLabel="Book a sitter for Luna" onPress={onPress} />);

    expect(screen.getByRole("button", { name: /book a sitter for luna/i })).toBeTruthy();
  });
});
