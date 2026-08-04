import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { press } from "../../../test-utils/press";
import { Switch } from "./switch";

const onValueChange = vi.fn();

describe("When an unchecked switch is pressed", () => {
  it("requests the checked state", () => {
    onValueChange.mockReset();
    render(<Switch isChecked={false} label="Instant booking" onValueChange={onValueChange} />);

    press(screen.getByRole("switch", { name: /instant booking/i }));

    expect(onValueChange).toHaveBeenCalledWith(true);
  });
});

describe("When a checked switch is pressed", () => {
  it("requests the unchecked state and reports itself as checked", () => {
    onValueChange.mockReset();
    render(<Switch isChecked label="Instant booking" onValueChange={onValueChange} />);

    const toggle = screen.getByRole("switch", { name: /instant booking/i, checked: true });
    press(toggle);

    expect(onValueChange).toHaveBeenCalledWith(false);
  });
});

describe("When a switch is disabled", () => {
  it("ignores presses", () => {
    onValueChange.mockReset();
    render(
      <Switch isChecked={false} isDisabled label="Instant booking" onValueChange={onValueChange} />,
    );

    press(screen.getByRole("switch", { name: /instant booking/i }));

    expect(onValueChange).not.toHaveBeenCalled();
  });
});
