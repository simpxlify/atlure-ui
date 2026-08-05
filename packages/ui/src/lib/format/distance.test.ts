import { describe, expect, it } from "vitest";

import { formatDistance } from "./distance";

describe("When formatting a metric distance", () => {
  it("stays in metres below a kilometre and switches to one decimal kilometres above it", () => {
    expect(formatDistance(320, "en-IE", "metric")).toBe("320 m");
    expect(formatDistance(12400, "en-IE", "metric")).toBe("12.4 km");
  });

  it("follows the locale's decimal separator", () => {
    expect(formatDistance(12400, "de-DE", "metric")).toContain("12,4");
  });
});

describe("When formatting an imperial distance", () => {
  it("renders miles instead of metres", () => {
    expect(formatDistance(320, "en-IE", "imperial")).toBe("0.2 mi");
    expect(formatDistance(16093, "en-IE", "imperial")).toBe("10.0 mi");
  });
});
