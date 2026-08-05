import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Textarea } from "./textarea";

const onChangeText = vi.fn();

describe("When text is typed into a textarea", () => {
  it("reports the change and accepts multiple lines", () => {
    onChangeText.mockReset();
    render(<Textarea accessibilityLabel="About your pet" onChangeText={onChangeText} />);

    const control = screen.getByLabelText("About your pet");

    fireEvent.change(control, { target: { value: "Luna is shy\nwith strangers" } });

    expect(onChangeText).toHaveBeenCalledWith("Luna is shy\nwith strangers");
    expect(control.tagName.toLowerCase()).toBe("textarea");
  });
});

describe("When a textarea has a counter and a maximum length", () => {
  it("counts the characters already typed", () => {
    render(
      <Textarea
        accessibilityLabel="About your pet"
        hasCounter
        maxLength={120}
        value="Luna is shy"
        onChangeText={onChangeText}
      />,
    );

    expect(screen.getByText("11/120")).toBeTruthy();
  });
});

describe("When a textarea has a counter but no maximum length", () => {
  it("shows no counter, because there is nothing to count towards", () => {
    render(
      <Textarea
        accessibilityLabel="About your pet"
        hasCounter
        value="Luna is shy"
        onChangeText={onChangeText}
      />,
    );

    expect(screen.queryByText(/11/)).toBeNull();
  });
});
