import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";

import { LocaleProvider } from "../../lib/locale";
import { Calendar } from "./calendar";

const componentSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "calendar.tsx"),
  "utf8",
);

describe("When the month grid renders under different locales", () => {
  it("starts March 2026 on Monday (first cell Feb 23) under de-DE", () => {
    render(
      <LocaleProvider locale="de-DE">
        <Calendar yearMonth="2026-03" />
      </LocaleProvider>,
    );

    expect(screen.getByRole("button", { name: /23\.\s*Februar\s*2026/ })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /1\.\s*März\s*2026.*Feb/ })).toBeNull();
  });

  it("starts March 2026 on Sunday (first cell March 1) under en-US", () => {
    render(
      <LocaleProvider locale="en-US">
        <Calendar yearMonth="2026-03" />
      </LocaleProvider>,
    );

    expect(screen.queryByRole("button", { name: /February 23, 2026/ })).toBeNull();
    expect(screen.getByRole("button", { name: /Sunday, March 1, 2026/ })).toBeTruthy();
  });
});

describe("When the calendar surface is inspected for Date discipline", () => {
  it("never constructs a Date inside the component source", () => {
    expect(componentSource).not.toMatch(/new Date\(/);
  });

  it("emits an ISO string from onSelect", () => {
    const onSelect = vi.fn();

    render(
      <LocaleProvider locale="en-US">
        <Calendar yearMonth="2026-03" onSelect={onSelect} />
      </LocaleProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Saturday, March 14, 2026/ }));

    expect(onSelect).toHaveBeenCalledWith("2026-03-14");
    expect(typeof onSelect.mock.calls[0]?.[0]).toBe("string");
  });
});

describe("When a day is excluded via disabledDates", () => {
  it("marks the day as accessibility-disabled and does not emit onSelect", () => {
    const onSelect = vi.fn();

    render(
      <LocaleProvider locale="en-US">
        <Calendar
          yearMonth="2026-03"
          onSelect={onSelect}
          disabledDates={(iso) => iso === "2026-03-18"}
        />
      </LocaleProvider>,
    );

    const day18 = screen.getByRole("button", { name: /Wednesday, March 18, 2026/ });
    expect(day18.getAttribute("aria-disabled")).toBe("true");

    fireEvent.click(day18);

    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe("When a day cell renders its accessibility label", () => {
  it("uses the localised full date, not just the day number", () => {
    render(
      <LocaleProvider locale="en-US">
        <Calendar yearMonth="2026-03" />
      </LocaleProvider>,
    );

    const cell = screen.getByRole("button", { name: /Saturday, March 14, 2026/ });
    const label = cell.getAttribute("aria-label") ?? "";

    expect(label).toContain("March");
    expect(label).not.toBe("14");
  });
});
