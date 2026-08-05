import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { press } from "../../../test-utils/press";
import { Button } from "../button/button";
import { EmptyState } from "./empty-state";

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
