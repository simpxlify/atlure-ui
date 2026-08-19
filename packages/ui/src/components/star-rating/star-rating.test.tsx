import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { press } from "../../../test-utils/press";
import { StarRating, starFillAt } from "./star-rating";

const onChange = vi.fn();

describe("When deciding how full each star is", () => {
  it("fills whole stars, halves the straddled one and empties the rest", () => {
    expect(starFillAt(3, 3.5)).toBe("full");
    expect(starFillAt(4, 3.5)).toBe("half");
    expect(starFillAt(5, 3.5)).toBe("empty");
  });

  it("treats an exact whole rating as having no half star", () => {
    expect(starFillAt(3, 3)).toBe("full");
    expect(starFillAt(4, 3)).toBe("empty");
  });
});

describe("When a fractional rating renders", () => {
  it("shows three filled, one half and one empty star", () => {
    render(<StarRating max={5} value={3.5} />);

    expect(screen.getAllByTestId("star-full")).toHaveLength(3);
    expect(screen.getAllByTestId("star-half")).toHaveLength(1);
    expect(screen.getAllByTestId("star-empty")).toHaveLength(1);
  });
});

describe("When a rating renders at the ends of its range", () => {
  it("shows every star empty at zero and every star full at the maximum", () => {
    const zero = render(<StarRating max={5} value={0} />);

    expect(screen.getAllByTestId("star-empty")).toHaveLength(5);
    zero.unmount();

    render(<StarRating max={5} value={5} />);

    expect(screen.getAllByTestId("star-full")).toHaveLength(5);
  });
});

describe("When a rating is not interactive", () => {
  it("renders no pressable and still announces the score", () => {
    render(<StarRating max={5} value={3.5} />);

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByLabelText("3.5 out of 5")).toBeTruthy();
  });
});

describe("When a rating is interactive", () => {
  it("reports the pressed star's value", () => {
    onChange.mockReset();
    render(<StarRating isInteractive max={5} onChange={onChange} value={2} />);

    press(screen.getByRole("button", { name: /rate 4 out of 5/i }));

    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("offers one pressable per star", () => {
    onChange.mockReset();
    render(<StarRating isInteractive max={5} onChange={onChange} value={2} />);

    expect(screen.getAllByRole("button")).toHaveLength(5);
  });
});

describe("When a rating shows its numeric value", () => {
  it("renders the score to one decimal place", () => {
    render(<StarRating showValue value={4.5} />);

    expect(screen.getByText("4.5")).toBeTruthy();
  });
});

describe("When a rating has no value", () => {
  it("renders every star empty and skips the count", () => {
    render(<StarRating max={5} value={null} count={12} />);

    expect(screen.getAllByTestId("star-empty")).toHaveLength(5);
    expect(screen.queryByText("(12)")).toBeNull();
  });
});

describe("When a rating carries a review count", () => {
  it("renders the count next to the stars", () => {
    render(<StarRating value={4.5} count={128} />);

    expect(screen.getByText("(128)")).toBeTruthy();
  });
});
