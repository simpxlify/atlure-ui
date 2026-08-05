import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { press } from "../../../test-utils/press";
import { SegmentedControl } from "./segmented-control";

const onValueChange = vi.fn();

const filters = [
  { value: "all", label: "All" },
  { value: "walking", label: "Walking" },
  { value: "boarding", label: "Boarding" },
  { value: "grooming", label: "Grooming" },
] as const;

describe("When a segmented control renders four options", () => {
  it("renders one pressable per option and selects only the active one", () => {
    onValueChange.mockReset();
    render(
      <SegmentedControl
        accessibilityLabel="Service filter"
        onValueChange={onValueChange}
        options={filters}
        value="all"
      />,
    );

    expect(screen.getAllByRole("tab")).toHaveLength(4);
    expect(screen.getByRole("tab", { name: /^all$/i, selected: true })).toBeTruthy();
    expect(screen.getAllByRole("tab", { selected: false })).toHaveLength(3);
  });
});

describe("When a segment is pressed", () => {
  it("reports that segment's value", () => {
    onValueChange.mockReset();
    render(
      <SegmentedControl
        accessibilityLabel="Service filter"
        onValueChange={onValueChange}
        options={filters}
        value="all"
      />,
    );

    press(screen.getByRole("tab", { name: /boarding/i }));

    expect(onValueChange).toHaveBeenCalledWith("boarding");
  });
});

describe("When a segmented control is disabled", () => {
  it("ignores presses on every segment", () => {
    onValueChange.mockReset();
    render(
      <SegmentedControl
        accessibilityLabel="Service filter"
        isDisabled
        onValueChange={onValueChange}
        options={filters}
        value="all"
      />,
    );

    press(screen.getByRole("tab", { name: /walking/i }));

    expect(onValueChange).not.toHaveBeenCalled();
  });
});
