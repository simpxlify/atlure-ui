import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RangeSlider } from "./range-slider";

describe("When the RangeSlider is rendered", () => {
  it("reports min, max and now on both thumbs", () => {
    render(
      <RangeSlider
        min={0}
        max={100}
        step={5}
        value={[20, 60]}
        accessibilityLabel="Price range"
      />,
    );

    const lower = screen.getByRole("slider", { name: "Price range lower bound" });
    const upper = screen.getByRole("slider", { name: "Price range upper bound" });

    expect(lower).toHaveAttribute("aria-valuemin", "0");
    expect(lower).toHaveAttribute("aria-valuemax", "60");
    expect(lower).toHaveAttribute("aria-valuenow", "20");

    expect(upper).toHaveAttribute("aria-valuemin", "20");
    expect(upper).toHaveAttribute("aria-valuemax", "100");
    expect(upper).toHaveAttribute("aria-valuenow", "60");
  });

  it("renders the formatted label bounds when formatLabel is provided", () => {
    render(
      <RangeSlider
        min={0}
        max={100}
        step={5}
        value={[20, 60]}
        accessibilityLabel="Price range"
        formatLabel={(v) => `${v} EUR`}
      />,
    );

    expect(screen.getByText("20 EUR - 60 EUR")).toBeInTheDocument();
  });
});
