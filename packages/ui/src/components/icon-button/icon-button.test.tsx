import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { press } from "../../../test-utils/press";
import { Text } from "../text/text";
import { IconButton } from "./icon-button";

const onPress = vi.fn();

describe("When an icon button is pressed", () => {
  it("notifies the caller and is announced by its accessibility label", () => {
    onPress.mockReset();
    render(
      <IconButton accessibilityLabel="Add Luna to favourites" icon={<Text>x</Text>} onPress={onPress} />,
    );

    press(screen.getByRole("button", { name: /add luna to favourites/i }));

    expect(onPress).toHaveBeenCalled();
  });
});

describe("When an icon button is disabled", () => {
  it("ignores presses and exposes the disabled state", () => {
    onPress.mockReset();
    render(
      <IconButton
        accessibilityLabel="Add Luna to favourites"
        icon={<Text>x</Text>}
        isDisabled
        onPress={onPress}
      />,
    );

    const button = screen.getByRole("button", { name: /add luna to favourites/i });
    press(button);

    expect(onPress).not.toHaveBeenCalled();
    expect(button).toHaveAttribute("aria-disabled", "true");
  });
});

describe("When an icon button is loading", () => {
  it("replaces the icon with a spinner, blocks presses and announces itself busy", () => {
    onPress.mockReset();
    render(
      <IconButton
        accessibilityLabel="Add Luna to favourites"
        icon={<Text>favourite-icon</Text>}
        isLoading
        onPress={onPress}
      />,
    );

    const button = screen.getByRole("button", { name: /add luna to favourites/i });
    press(button);

    expect(onPress).not.toHaveBeenCalled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByText("favourite-icon")).toBeNull();
  });
});
