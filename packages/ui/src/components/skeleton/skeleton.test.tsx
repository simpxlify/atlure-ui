import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "./skeleton";

describe("When a skeleton is shown", () => {
  it("announces the pending content as busy", () => {
    render(<Skeleton accessibilityLabel="Loading sitters" isAnimated={false} />);

    const placeholder = screen.getByRole("progressbar", { name: /loading sitters/i });

    expect(placeholder).toHaveAttribute("aria-busy", "true");
  });
});
