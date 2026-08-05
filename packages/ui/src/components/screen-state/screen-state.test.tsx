import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Text } from "../text/text";
import { ScreenState, type ScreenStatus } from "./screen-state";

function renderScreenState(status: ScreenStatus, isEmpty = false) {
  return render(
    <ScreenState
      status={status}
      isEmpty={isEmpty}
      loadingState={<Text>Loading sitters</Text>}
      errorState={<Text>Could not load sitters</Text>}
      emptyState={<Text>No sitters nearby</Text>}
    >
      <Text>Ana, 4.9 stars</Text>
    </ScreenState>,
  );
}

describe("When a screen is loading", () => {
  it("shows only the loading state", () => {
    renderScreenState("loading");

    expect(screen.getByText("Loading sitters")).toBeTruthy();
    expect(screen.queryByText("Ana, 4.9 stars")).toBeNull();
  });
});

describe("When a screen failed to load", () => {
  it("shows only the error state", () => {
    renderScreenState("error");

    expect(screen.getByText("Could not load sitters")).toBeTruthy();
    expect(screen.queryByText("Ana, 4.9 stars")).toBeNull();
  });
});

describe("When a screen loaded nothing", () => {
  it("shows only the empty state", () => {
    renderScreenState("ready", true);

    expect(screen.getByText("No sitters nearby")).toBeTruthy();
    expect(screen.queryByText("Ana, 4.9 stars")).toBeNull();
  });
});

describe("When a screen loaded content", () => {
  it("shows the content and none of the placeholder states", () => {
    renderScreenState("ready");

    expect(screen.getByText("Ana, 4.9 stars")).toBeTruthy();
    expect(screen.queryByText("Loading sitters")).toBeNull();
    expect(screen.queryByText("Could not load sitters")).toBeNull();
    expect(screen.queryByText("No sitters nearby")).toBeNull();
  });
});

describe("When a screen is loading and would also be empty", () => {
  it("keeps the loading state, because emptiness is not yet known", () => {
    renderScreenState("loading", true);

    expect(screen.getByText("Loading sitters")).toBeTruthy();
    expect(screen.queryByText("No sitters nearby")).toBeNull();
  });
});
