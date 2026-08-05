import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { press } from "../../../test-utils/press";
import { Switch } from "../switch/switch";
import { SettingsRow } from "./settings-row";

const onValueChange = vi.fn();

describe("When a settings row renders with a description", () => {
  it("shows the title and the description alongside its control", () => {
    onValueChange.mockReset();
    render(
      <SettingsRow
        control={<Switch isChecked={false} onValueChange={onValueChange} />}
        description="Get notified when a sitter replies"
        title="Booking updates"
      />,
    );

    expect(screen.getByText("Booking updates")).toBeTruthy();
    expect(screen.getByText("Get notified when a sitter replies")).toBeTruthy();
    expect(screen.getByRole("switch")).toBeTruthy();
  });
});

describe("When a settings row's control is operated", () => {
  it("passes the interaction through to the control", () => {
    onValueChange.mockReset();
    render(
      <SettingsRow
        control={<Switch isChecked={false} onValueChange={onValueChange} />}
        title="Booking updates"
      />,
    );

    press(screen.getByRole("switch"));

    expect(onValueChange).toHaveBeenCalledWith(true);
  });
});

describe("When a settings row names its control", () => {
  it("labels the control region with the row title so the control is not announced bare", () => {
    onValueChange.mockReset();
    const { container } = render(
      <SettingsRow
        control={<Switch isChecked={false} onValueChange={onValueChange} />}
        title="Booking updates"
      />,
    );

    const labelledRegion = container.querySelector("[aria-labelledby]");
    const titleId = labelledRegion?.getAttribute("aria-labelledby");

    expect(titleId).toBeTruthy();
    expect(container.querySelector(`#${titleId}`)?.textContent).toBe("Booking updates");
  });
});
