import { describe, expect, it } from "vitest";

import {
  addMonths,
  buildMonthGrid,
  daysBetween,
  daysInMonth,
  dayOfWeek,
  firstDayOfWeek,
  formatTimeValue,
  isDateInRange,
  parseTimeValue,
} from "./calendar";

describe("firstDayOfWeek", () => {
  it("returns Sunday for en-US", () => {
    expect(firstDayOfWeek("en-US")).toBe(0);
  });

  it("returns Monday for de-DE", () => {
    expect(firstDayOfWeek("de-DE")).toBe(1);
  });

  it("returns Monday for en-IE", () => {
    expect(firstDayOfWeek("en-IE")).toBe(1);
  });
});

describe("dayOfWeek", () => {
  it("puts 2026-03-01 on Sunday", () => {
    expect(dayOfWeek("2026-03-01")).toBe(0);
  });
});

describe("daysInMonth", () => {
  it("returns 29 for February 2024 (leap year)", () => {
    expect(daysInMonth(2024, 2)).toBe(29);
  });

  it("returns 28 for February 2026", () => {
    expect(daysInMonth(2026, 2)).toBe(28);
  });
});

describe("addMonths", () => {
  it("wraps forward across a year", () => {
    expect(addMonths("2026-12", 1)).toBe("2027-01");
  });

  it("wraps backward across a year", () => {
    expect(addMonths("2026-01", -1)).toBe("2025-12");
  });
});

describe("daysBetween", () => {
  it("counts three nights between March 14 and March 17", () => {
    expect(daysBetween("2026-03-14", "2026-03-17")).toBe(3);
  });

  it("counts one night between March 14 and March 15", () => {
    expect(daysBetween("2026-03-14", "2026-03-15")).toBe(1);
  });
});

describe("buildMonthGrid", () => {
  it("starts the March 2026 grid on Feb 23 under Monday-first", () => {
    const weeks = buildMonthGrid("2026-03", 1);
    const firstCell = weeks[0]?.[0];
    expect(firstCell?.iso).toBe("2026-02-23");
    expect(firstCell?.isCurrentMonth).toBe(false);
  });

  it("starts the March 2026 grid on March 1 under Sunday-first", () => {
    const weeks = buildMonthGrid("2026-03", 0);
    const firstCell = weeks[0]?.[0];
    expect(firstCell?.iso).toBe("2026-03-01");
    expect(firstCell?.isCurrentMonth).toBe(true);
  });
});

describe("isDateInRange", () => {
  it("respects a minDate bound", () => {
    expect(isDateInRange("2026-03-01", "2026-03-05")).toBe(false);
    expect(isDateInRange("2026-03-06", "2026-03-05")).toBe(true);
  });

  it("respects a maxDate bound", () => {
    expect(isDateInRange("2026-03-10", undefined, "2026-03-05")).toBe(false);
  });
});

describe("time helpers", () => {
  it("round-trips through formatTimeValue and parseTimeValue", () => {
    expect(formatTimeValue(9, 30)).toBe("09:30");
    expect(parseTimeValue("09:30")).toEqual({ hour: 9, minute: 30 });
  });

  it("rejects out-of-range times", () => {
    expect(parseTimeValue("24:00")).toBeUndefined();
    expect(parseTimeValue("12:60")).toBeUndefined();
    expect(parseTimeValue("not-a-time")).toBeUndefined();
  });
});
