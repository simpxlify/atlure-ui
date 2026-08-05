import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { press } from "../../../test-utils/press";
import { Checkbox } from "./checkbox";

const onValueChange = vi.fn();

describe("When an unchecked checkbox is pressed", () => {
  it("requests the checked state", () => {
    onValueChange.mockReset();
    render(
      <Checkbox isChecked={false} label="I accept the terms" onValueChange={onValueChange} />,
    );

    press(screen.getByRole("checkbox", { name: /i accept the terms/i }));

    expect(onValueChange).toHaveBeenCalledWith(true);
  });
});

describe("When a checked checkbox is pressed", () => {
  it("requests the unchecked state and reports itself as checked", () => {
    onValueChange.mockReset();
    render(<Checkbox isChecked label="I accept the terms" onValueChange={onValueChange} />);

    const checkbox = screen.getByRole("checkbox", { name: /i accept the terms/i, checked: true });
    press(checkbox);

    expect(onValueChange).toHaveBeenCalledWith(false);
  });
});

describe("When a checkbox is indeterminate", () => {
  it("announces itself as mixed rather than checked or unchecked", () => {
    onValueChange.mockReset();
    render(
      <Checkbox
        isChecked={false}
        isIndeterminate
        label="Select all pets"
        onValueChange={onValueChange}
      />,
    );

    expect(screen.getByRole("checkbox", { name: /select all pets/i })).toHaveAttribute(
      "aria-checked",
      "mixed",
    );
  });

  it("resolves to the checked state when pressed", () => {
    onValueChange.mockReset();
    render(
      <Checkbox
        isChecked={false}
        isIndeterminate
        label="Select all pets"
        onValueChange={onValueChange}
      />,
    );

    press(screen.getByRole("checkbox", { name: /select all pets/i }));

    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it("renders a different indicator than the checked state", () => {
    const indeterminate = render(
      <Checkbox isChecked={false} isIndeterminate onValueChange={onValueChange} />,
    );
    const indeterminateMarkup = indeterminate.container.innerHTML;
    indeterminate.unmount();

    const checked = render(<Checkbox isChecked onValueChange={onValueChange} />);

    expect(checked.container.innerHTML).not.toBe(indeterminateMarkup);
  });
});

describe("When a checkbox is disabled", () => {
  it("ignores presses", () => {
    onValueChange.mockReset();
    render(
      <Checkbox
        isChecked={false}
        isDisabled
        label="I accept the terms"
        onValueChange={onValueChange}
      />,
    );

    press(screen.getByRole("checkbox", { name: /i accept the terms/i }));

    expect(onValueChange).not.toHaveBeenCalled();
  });
});
