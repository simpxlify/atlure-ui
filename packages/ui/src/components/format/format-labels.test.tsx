import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LocaleProvider } from "../../lib/locale";
import { DateLabel, DateRangeLabel } from "./date-label";
import { DistanceLabel } from "./distance-label";
import { DurationLabel } from "./duration-label";
import { MoneyLabel } from "./money-label";

describe("When a money label renders under a locale", () => {
  it("formats the amount with that locale's separators", () => {
    render(
      <LocaleProvider locale="de-DE">
        <MoneyLabel value={{ amountMinor: 12000, currency: "EUR" }} />
      </LocaleProvider>,
    );

    expect(screen.getByText(/120,00/)).toBeTruthy();
  });

  it("keeps the value's own currency when the locale uses another", () => {
    render(
      <LocaleProvider locale="de-DE">
        <MoneyLabel value={{ amountMinor: 12000, currency: "GBP" }} />
      </LocaleProvider>,
    );

    expect(screen.getByText(/£/)).toBeTruthy();
  });

  it("appends the billing period when given one", () => {
    render(
      <LocaleProvider locale="en-IE">
        <MoneyLabel per="night" value={{ amountMinor: 4500, currency: "EUR" }} />
      </LocaleProvider>,
    );

    expect(screen.getByText("€45.00 per night")).toBeTruthy();
  });
});

describe("When a distance label renders without a provider", () => {
  it("falls back to the metric default", () => {
    render(<DistanceLabel meters={12400} />);

    expect(screen.getByText("12.4 km")).toBeTruthy();
  });
});

describe("When a distance label renders under an imperial provider", () => {
  it("switches to miles", () => {
    render(
      <LocaleProvider locale="en-IE" measurementSystem="imperial">
        <DistanceLabel meters={16093} />
      </LocaleProvider>,
    );

    expect(screen.getByText("10.0 mi")).toBeTruthy();
  });
});

describe("When a duration label renders", () => {
  it("splits hours from minutes using the provider's locale", () => {
    render(
      <LocaleProvider locale="de-DE">
        <DurationLabel minutes={90} />
      </LocaleProvider>,
    );

    expect(screen.getByText("1 Std. 30 Min.")).toBeTruthy();
  });
});

describe("When a date label renders in relative mode", () => {
  it("describes the distance from now instead of an absolute date", () => {
    const inThreeHours = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();

    render(<DateLabel relative value={inThreeHours} />);

    expect(screen.getByText(/in 2 hours|in 3 hours/)).toBeTruthy();
  });
});

describe("When a date range label renders", () => {
  it("shows both ends of the booking", () => {
    render(
      <LocaleProvider locale="en-IE">
        <DateRangeLabel end="2026-03-08T17:00:00.000Z" start="2026-03-05T09:00:00.000Z" />
      </LocaleProvider>,
    );

    expect(screen.getByText(/5.*8/)).toBeTruthy();
  });
});
