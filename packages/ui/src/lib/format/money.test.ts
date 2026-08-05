import { describe, expect, it } from "vitest";

import { formatMoney, formatMoneyRate } from "./money";

describe("When formatting a euro amount", () => {
  it("uses the locale's own separators and symbol placement", () => {
    expect(formatMoney({ amountMinor: 12000, currency: "EUR" }, "de-DE")).toContain("120,00");
    expect(formatMoney({ amountMinor: 12000, currency: "EUR" }, "de-DE")).toContain("€");
    expect(formatMoney({ amountMinor: 12000, currency: "EUR" }, "en-IE")).toBe("€120.00");
  });
});

describe("When formatting an amount whose currency differs from the locale", () => {
  it("takes the currency from the value, not the locale", () => {
    expect(formatMoney({ amountMinor: 12000, currency: "GBP" }, "en-IE")).toContain("£");
  });

  it("honours a currency with no minor unit subdivision in the active locale", () => {
    expect(formatMoney({ amountMinor: 250000, currency: "HUF" }, "hu-HU")).toContain("2");
  });
});

describe("When formatting a rate", () => {
  it("appends the billing period to the formatted amount", () => {
    expect(formatMoneyRate({ amountMinor: 1500, currency: "EUR" }, "en-IE", "hour")).toBe(
      "€15.00 per hour",
    );
  });
});
