import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { press } from "../../../test-utils/press";
import { Text } from "../text/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const onValueChange = vi.fn();

function renderActivityTabs() {
  return render(
    <Tabs defaultValue="upcoming" onValueChange={onValueChange}>
      <TabsList accessibilityLabel="Activity sections">
        <TabsTrigger label="Upcoming" value="upcoming" />
        <TabsTrigger label="Past" value="past" />
        <TabsTrigger label="Cancelled" value="cancelled" />
      </TabsList>
      <TabsContent value="upcoming">
        <Text>Two walks this week</Text>
      </TabsContent>
      <TabsContent value="past">
        <Text>Eleven completed bookings</Text>
      </TabsContent>
      <TabsContent value="cancelled">
        <Text>No cancellations</Text>
      </TabsContent>
    </Tabs>,
  );
}

describe("When tabs render with a default value", () => {
  it("marks exactly one trigger as selected", () => {
    onValueChange.mockReset();
    renderActivityTabs();

    expect(screen.getByRole("tab", { name: /upcoming/i, selected: true })).toBeTruthy();
    expect(screen.getAllByRole("tab", { selected: false })).toHaveLength(2);
  });
});

describe("When another tab is pressed", () => {
  it("moves the selection to it and leaves only that one selected", () => {
    onValueChange.mockReset();
    renderActivityTabs();

    press(screen.getByRole("tab", { name: /past/i }));

    expect(onValueChange).toHaveBeenCalledWith("past");
    expect(screen.getByRole("tab", { name: /past/i, selected: true })).toBeTruthy();
    expect(screen.getAllByRole("tab", { selected: false })).toHaveLength(2);
  });
});

describe("When a tab has never been activated", () => {
  it("does not mount its content, mounts it on activation and keeps it mounted afterwards", () => {
    onValueChange.mockReset();
    renderActivityTabs();

    expect(screen.queryByText("Eleven completed bookings")).toBeNull();

    press(screen.getByRole("tab", { name: /past/i }));

    expect(screen.getByText("Eleven completed bookings")).toBeTruthy();

    press(screen.getByRole("tab", { name: /upcoming/i }));

    expect(screen.getByText("Eleven completed bookings")).toBeTruthy();
    expect(screen.queryByText("No cancellations")).toBeNull();
  });
});

describe("When tabs are controlled by their caller", () => {
  it("reports the requested value without moving the selection itself", () => {
    onValueChange.mockReset();
    render(
      <Tabs defaultValue="upcoming" onValueChange={onValueChange} value="upcoming">
        <TabsList accessibilityLabel="Activity sections">
          <TabsTrigger label="Upcoming" value="upcoming" />
          <TabsTrigger label="Past" value="past" />
        </TabsList>
      </Tabs>,
    );

    press(screen.getByRole("tab", { name: /past/i }));

    expect(onValueChange).toHaveBeenCalledWith("past");
    expect(screen.getByRole("tab", { name: /upcoming/i, selected: true })).toBeTruthy();
  });
});

describe("When a tab trigger is disabled", () => {
  it("ignores presses", () => {
    onValueChange.mockReset();
    render(
      <Tabs defaultValue="upcoming" onValueChange={onValueChange}>
        <TabsList accessibilityLabel="Activity sections">
          <TabsTrigger label="Upcoming" value="upcoming" />
          <TabsTrigger isDisabled label="Past" value="past" />
        </TabsList>
      </Tabs>,
    );

    press(screen.getByRole("tab", { name: /past/i }));

    expect(onValueChange).not.toHaveBeenCalled();
  });
});
