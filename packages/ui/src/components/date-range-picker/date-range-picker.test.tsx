import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LocaleProvider } from "../../lib/locale";
import { DateRangePicker } from "./date-range-picker";

describe("When a range picker gets two taps that satisfy minNights", () => {
  it("commits the range with the start and end ordered", () => {
    const onRangeChange = vi.fn();

    render(
      <LocaleProvider locale="en-US">
        <DateRangePicker yearMonth="2026-03" onRangeChange={onRangeChange} minNights={2} />
      </LocaleProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Saturday, March 14, 2026/ }));
    fireEvent.click(screen.getByRole("button", { name: /Tuesday, March 17, 2026/ }));

    expect(onRangeChange).toHaveBeenCalledTimes(1);
    expect(onRangeChange).toHaveBeenCalledWith({ start: "2026-03-14", end: "2026-03-17" });
  });
});

describe("When a range picker gets a 1-night attempt under minNights=2", () => {
  it("does not call onRangeChange and leaves the existing range untouched", () => {
    const onRangeChange = vi.fn();
    const initialRange = { start: "2026-03-01", end: "2026-03-05" } as const;

    render(
      <LocaleProvider locale="en-US">
        <DateRangePicker
          yearMonth="2026-03"
          range={initialRange}
          onRangeChange={onRangeChange}
          minNights={2}
        />
      </LocaleProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Saturday, March 14, 2026/ }));
    fireEvent.click(screen.getByRole("button", { name: /Sunday, March 15, 2026/ }));

    expect(onRangeChange).not.toHaveBeenCalled();
  });
});
