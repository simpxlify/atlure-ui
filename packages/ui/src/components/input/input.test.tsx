import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Input } from "./input";

const onChangeText = vi.fn();

describe("When text is typed into an input", () => {
  it("reports every change to the caller", () => {
    onChangeText.mockReset();
    render(<Input accessibilityLabel="Search sitters" onChangeText={onChangeText} />);

    fireEvent.change(screen.getByLabelText("Search sitters"), { target: { value: "Lisbon" } });

    expect(onChangeText).toHaveBeenCalledWith("Lisbon");
  });
});

describe("When an input is disabled", () => {
  it("is not editable and announces the disabled state", () => {
    render(<Input accessibilityLabel="Search sitters" isDisabled onChangeText={onChangeText} />);

    const input = screen.getByLabelText("Search sitters");

    expect(input).toHaveAttribute("readonly");
    expect(input).toHaveAttribute("aria-disabled", "true");
  });
});

describe("When an input is invalid", () => {
  it("announces the invalid state", () => {
    render(<Input accessibilityLabel="Search sitters" isInvalid onChangeText={onChangeText} />);

    expect(screen.getByLabelText("Search sitters")).toHaveAttribute("aria-invalid", "true");
  });
});
