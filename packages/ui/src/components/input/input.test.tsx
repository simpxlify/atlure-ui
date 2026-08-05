import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Text } from "../text/text";
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

describe("When an input is given icon slots", () => {
  it("renders both slots alongside a still-typeable control", () => {
    onChangeText.mockReset();
    render(
      <Input
        accessibilityLabel="Search sitters"
        leadingIcon={<Text>at</Text>}
        trailingIcon={<Text>clear</Text>}
        onChangeText={onChangeText}
      />,
    );

    fireEvent.change(screen.getByLabelText("Search sitters"), { target: { value: "Lisbon" } });

    expect(screen.getByText("at")).toBeTruthy();
    expect(screen.getByText("clear")).toBeTruthy();
    expect(onChangeText).toHaveBeenCalledWith("Lisbon");
  });
});
