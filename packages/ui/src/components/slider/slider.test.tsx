import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Slider } from "./slider";

describe("When the Slider is rendered", () => {
  it("reports min, max and now to screen readers", () => {
    render(
      <Slider
        min={500}
        max={50_000}
        step={500}
        value={1_500}
        accessibilityLabel="Search radius"
      />,
    );

    const control = screen.getByRole("slider", { name: "Search radius" });

    expect(control).toHaveAttribute("aria-valuemin", "500");
    expect(control).toHaveAttribute("aria-valuemax", "50000");
    expect(control).toHaveAttribute("aria-valuenow", "1500");
  });

  it("snaps a value passed as prop onto a step boundary", () => {
    render(
      <Slider
        min={500}
        max={50_000}
        step={500}
        value={1_723}
        accessibilityLabel="Search radius"
      />,
    );

    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "1500");
  });

  it("renders the formatted label when formatLabel is provided", () => {
    render(
      <Slider
        min={500}
        max={50_000}
        step={500}
        value={2_500}
        accessibilityLabel="Search radius"
        formatLabel={(v) => `${v / 1000} km`}
      />,
    );

    expect(screen.getByText("2.5 km")).toBeInTheDocument();
  });
});
