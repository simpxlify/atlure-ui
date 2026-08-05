import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { press } from "../../../test-utils/press";
import { Text } from "../text/text";
import { ListRow } from "./list-row";

const onPress = vi.fn();

describe("When a list row has no press handler", () => {
  it("is not exposed as a button", () => {
    render(<ListRow title="Notifications" subtitle="Push and email" />);

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("Notifications")).toBeTruthy();
    expect(screen.getByText("Push and email")).toBeTruthy();
  });
});

describe("When a pressable list row is pressed", () => {
  it("notifies the caller, naming itself by its title", () => {
    onPress.mockReset();
    render(<ListRow title="Notifications" hasChevron onPress={onPress} />);

    press(screen.getByRole("button", { name: /notifications/i }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe("When a pressable list row is disabled", () => {
  it("ignores presses", () => {
    onPress.mockReset();
    render(<ListRow title="Notifications" isDisabled onPress={onPress} />);

    press(screen.getByRole("button", { name: /notifications/i }));

    expect(onPress).not.toHaveBeenCalled();
  });
});

describe("When a list row has leading and trailing slots", () => {
  it("renders both alongside the title", () => {
    render(
      <ListRow
        title="Ana Silva"
        leading={<Text>AS</Text>}
        trailing={<Text>2 unread</Text>}
        onPress={onPress}
      />,
    );

    expect(screen.getByText("AS")).toBeTruthy();
    expect(screen.getByText("2 unread")).toBeTruthy();
  });
});
