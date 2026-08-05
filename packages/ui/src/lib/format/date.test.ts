import { describe, expect, it } from "vitest";

import { formatDate, formatDateRange, formatRelativeDate } from "./date";

const bookingStart = "2026-03-05T09:00:00.000Z";
const bookingEnd = "2026-03-08T17:00:00.000Z";

describe("When formatting a single date", () => {
  it("orders the parts the way the locale expects", () => {
    expect(formatDate(bookingStart, "en-IE")).toContain("2026");
    expect(formatDate(bookingStart, "de-DE")).toContain("2026");
  });
});

describe("When formatting a date range", () => {
  it("collapses both ends into one locale-aware range string", () => {
    const range = formatDateRange(bookingStart, bookingEnd, "en-IE");

    expect(range).toContain("5");
    expect(range).toContain("8");
  });
});

describe("When formatting a date relative to now", () => {
  it("describes a future date in days", () => {
    const now = new Date("2026-03-03T09:00:00.000Z");

    expect(formatRelativeDate(bookingStart, "en-IE", now)).toBe("in 2 days");
  });

  it("describes a past date in hours", () => {
    const now = new Date("2026-03-05T12:00:00.000Z");

    expect(formatRelativeDate(bookingStart, "en-IE", now)).toBe("3 hours ago");
  });
});
