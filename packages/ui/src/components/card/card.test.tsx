import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { press } from "../../../test-utils/press";
import { Text } from "../text/text";
import { Card } from "./card";

const onPress = vi.fn();

describe("When a card has no press handler", () => {
  it("is not exposed as a button", () => {
    render(
      <Card>
        <Text>Luna needs a sitter</Text>
      </Card>,
    );

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("Luna needs a sitter")).toBeTruthy();
  });
});

describe("When a pressable card is pressed", () => {
  it("notifies the caller", () => {
    onPress.mockReset();
    render(
      <Card accessibilityLabel="Open Luna's booking" onPress={onPress}>
        <Text>Luna needs a sitter</Text>
      </Card>,
    );

    press(screen.getByRole("button", { name: /open luna's booking/i }));

    expect(onPress).toHaveBeenCalled();
  });
});

describe("When a pressable card is disabled", () => {
  it("ignores presses", () => {
    onPress.mockReset();
    render(
      <Card accessibilityLabel="Open Luna's booking" isDisabled onPress={onPress}>
        <Text>Luna needs a sitter</Text>
      </Card>,
    );

    press(screen.getByRole("button", { name: /open luna's booking/i }));

    expect(onPress).not.toHaveBeenCalled();
  });
});
