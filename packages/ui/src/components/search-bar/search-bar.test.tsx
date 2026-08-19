import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { press } from "../../../test-utils/press";
import { SearchBar } from "./search-bar";

const onChangeText = vi.fn();
const onChangeDebounced = vi.fn();

function renderSearchBar(value: string) {
  return render(
    <SearchBar
      accessibilityLabel="Search sitters"
      clearAccessibilityLabel="Clear search"
      value={value}
      onChangeText={onChangeText}
      onChangeDebounced={onChangeDebounced}
    />,
  );
}

beforeEach(() => {
  vi.useFakeTimers();
  onChangeText.mockReset();
  onChangeDebounced.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
  onChangeText.mockClear();
  onChangeDebounced.mockClear();
});

describe("When three keystrokes land inside the debounce window", () => {
  it("notifies the debounced caller once, with the last value", () => {
    renderSearchBar("");
    const control = screen.getByRole("textbox");

    fireEvent.change(control, { target: { value: "Lis" } });
    vi.advanceTimersByTime(100);
    fireEvent.change(control, { target: { value: "Lisb" } });
    vi.advanceTimersByTime(100);
    fireEvent.change(control, { target: { value: "Lisbo" } });
    vi.advanceTimersByTime(300);

    expect(onChangeText).toHaveBeenCalledTimes(3);
    expect(onChangeDebounced).toHaveBeenCalledTimes(1);
    expect(onChangeDebounced).toHaveBeenCalledWith("Lisbo");
  });

  it("stays silent until the window closes", () => {
    renderSearchBar("");

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Lis" } });
    vi.advanceTimersByTime(299);

    expect(onChangeDebounced).not.toHaveBeenCalled();
  });
});

describe("When the search field is empty", () => {
  it("offers no clear affordance", () => {
    renderSearchBar("");

    expect(screen.queryByRole("button", { name: /clear search/i })).toBeNull();
  });
});

describe("When SearchBar runs uncontrolled with defaultValue and onCommit", () => {
  it("maintains its own draft and commits once after debounce", () => {
    const onCommit = vi.fn();

    render(
      <SearchBar
        accessibilityLabel="Search sitters"
        clearAccessibilityLabel="Clear search"
        defaultValue=""
        onCommit={onCommit}
      />,
    );

    const control = screen.getByRole("textbox");

    fireEvent.change(control, { target: { value: "Por" } });
    fireEvent.change(control, { target: { value: "Porto" } });
    vi.advanceTimersByTime(300);

    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenCalledWith("Porto");
    expect((control as HTMLInputElement).value).toBe("Porto");
  });
});

describe("When the clear affordance is pressed", () => {
  it("empties the field and notifies the debounced caller immediately", () => {
    renderSearchBar("Lisbon");

    press(screen.getByRole("button", { name: /clear search/i }));

    expect(onChangeText).toHaveBeenCalledWith("");
    expect(onChangeDebounced).toHaveBeenCalledWith("");
    expect(onChangeDebounced).toHaveBeenCalledTimes(1);
  });
});
