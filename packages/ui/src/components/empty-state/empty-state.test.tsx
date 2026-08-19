import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { press } from "../../../test-utils/press";
import { Button } from "../button/button";
import { DEFAULT_EMPTY_STATE_COPY, EmptyState } from "./empty-state";

const onPress = vi.fn();

describe("When an empty state has an action", () => {
  it("titles the state and runs the action the caller supplied", () => {
    onPress.mockReset();
    render(
      <EmptyState
        title="No sitters nearby"
        description="Try widening your search area."
        action={<Button label="Change area" onPress={onPress} />}
      />,
    );

    expect(screen.getByRole("heading", { name: /no sitters nearby/i })).toBeTruthy();
    expect(screen.getByText("Try widening your search area.")).toBeTruthy();

    press(screen.getByRole("button", { name: /change area/i }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe("When an empty state has no action and no description", () => {
  it("shows the title alone", () => {
    render(<EmptyState title="No bookings yet" />);

    expect(screen.getByRole("heading", { name: /no bookings yet/i })).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("When an empty state uses a preset", () => {
  it("fills the title and description from DEFAULT_EMPTY_STATE_COPY", () => {
    render(<EmptyState preset="no-results" />);

    const copy = DEFAULT_EMPTY_STATE_COPY["no-results"];
    expect(screen.getByRole("heading", { name: copy.title })).toBeTruthy();
    expect(screen.getByText(copy.message)).toBeTruthy();
  });

  it("lets explicit title and description override the preset", () => {
    render(
      <EmptyState preset="no-radius" title="Custom title" description="Custom description" />,
    );

    const preset = DEFAULT_EMPTY_STATE_COPY["no-radius"];
    expect(screen.getByRole("heading", { name: /custom title/i })).toBeTruthy();
    expect(screen.getByText("Custom description")).toBeTruthy();
    expect(screen.queryByText(preset.title)).toBeNull();
    expect(screen.queryByText(preset.message)).toBeNull();
  });
});
