import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar } from "./avatar";

describe("When an avatar has no image", () => {
  it("falls back to the initials of the first two names", () => {
    render(<Avatar name="ana maria pereira" />);

    expect(screen.getByText("AM")).toBeTruthy();
  });
});

describe("When an avatar has an image", () => {
  it("shows the image labelled with the person's name instead of initials", () => {
    render(<Avatar name="Ana Pereira" uri="https://atlure.test/ana.jpg" />);

    expect(screen.queryByText("AP")).toBeNull();
    expect(screen.getAllByLabelText("Ana Pereira").length).toBeGreaterThan(0);
  });
});
