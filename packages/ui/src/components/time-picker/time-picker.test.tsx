import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LocaleProvider } from "../../lib/locale";
import { TimePicker } from "./time-picker";

describe("When a time is picked column by column", () => {
  it("emits HH:MM composing the tapped minute with the current hour", () => {
    const onChange = vi.fn();

    render(
      <LocaleProvider locale="en-US">
        <TimePicker
          isOpen
          onClose={() => {}}
          value="09:00"
          onChange={onChange}
          minuteStep={15}
          accessibilityLabel="Time"
          backdropAccessibilityLabel="Close"
        />
      </LocaleProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "30" }));

    expect(onChange).toHaveBeenLastCalledWith("09:30");
  });
});

describe("When a locale prefers 24-hour", () => {
  it("labels hours without an AM/PM period", () => {
    render(
      <LocaleProvider locale="de-DE">
        <TimePicker
          isOpen
          onClose={() => {}}
          onChange={() => {}}
          accessibilityLabel="Uhrzeit"
          backdropAccessibilityLabel="Schließen"
        />
      </LocaleProvider>,
    );

    expect(screen.queryByRole("button", { name: /\d+\s*AM/i })).toBeNull();
    expect(screen.getAllByRole("button", { name: /Uhr/i }).length).toBeGreaterThan(0);
  });
});
