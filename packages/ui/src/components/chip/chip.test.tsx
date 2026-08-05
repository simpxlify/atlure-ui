import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { press } from "../../../test-utils/press";
import { chipVariants } from "../../variants/chip-variants";
import { Chip } from "./chip";

const onPress = vi.fn();
const onDismiss = vi.fn();

describe("When a chip is selected", () => {
  it("resolves a different class than when unselected", () => {
    expect(chipVariants({ isSelected: true })).not.toBe(chipVariants({ isSelected: false }));
    expect(chipVariants({ isSelected: true })).toContain("bg-primary");
    expect(chipVariants({ isSelected: false })).not.toContain("bg-primary");
  });

  it("reports itself as selected to assistive technology", () => {
    render(<Chip isSelected label="Dog walking" onPress={onPress} />);

    expect(screen.getByRole("button", { name: /dog walking/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});

describe("When an unselected chip is pressed", () => {
  it("notifies the caller and does not report itself selected", () => {
    onPress.mockReset();
    render(<Chip label="Dog walking" onPress={onPress} />);

    const chip = screen.getByRole("button", { name: /dog walking/i });

    expect(chip).toHaveAttribute("aria-selected", "false");

    press(chip);

    expect(onPress).toHaveBeenCalled();
  });
});

describe("When a chip has a dismiss affordance", () => {
  it("announces the dismiss control separately from the chip itself", () => {
    onDismiss.mockReset();
    render(<Chip label="Dog walking" onDismiss={onDismiss} onPress={onPress} />);

    press(screen.getByRole("button", { name: /remove dog walking/i }));

    expect(onDismiss).toHaveBeenCalled();
  });

  it("lets the caller override the dismiss label", () => {
    onDismiss.mockReset();
    render(
      <Chip
        dismissAccessibilityLabel="Clear the walking filter"
        label="Dog walking"
        onDismiss={onDismiss}
      />,
    );

    expect(screen.getByRole("button", { name: /clear the walking filter/i })).toBeTruthy();
  });
});

describe("When a chip has no dismiss handler", () => {
  it("renders only the chip itself", () => {
    render(<Chip label="Dog walking" onPress={onPress} />);

    expect(screen.getAllByRole("button")).toHaveLength(1);
  });
});

describe("When a chip is disabled", () => {
  it("ignores presses", () => {
    onPress.mockReset();
    render(<Chip isDisabled label="Dog walking" onPress={onPress} />);

    press(screen.getByRole("button", { name: /dog walking/i }));

    expect(onPress).not.toHaveBeenCalled();
  });
});
