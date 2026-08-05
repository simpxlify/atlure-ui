import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { press } from "../../../test-utils/press";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const onValueChange = vi.fn();

function renderRoleGroup(selected: string | undefined = "parent") {
  return render(
    <RadioGroup onValueChange={onValueChange} value={selected}>
      <RadioGroupItem label="Pet parent" value="parent" />
      <RadioGroupItem label="Sitter" value="sitter" />
      <RadioGroupItem label="Both" value="both" />
    </RadioGroup>,
  );
}

describe("When a radio group renders with a selected value", () => {
  it("reports exactly one item as checked", () => {
    onValueChange.mockReset();
    renderRoleGroup();

    expect(screen.getByRole("radio", { name: /pet parent/i, checked: true })).toBeTruthy();
    expect(screen.getAllByRole("radio", { checked: false })).toHaveLength(2);
  });
});

describe("When another radio group item is pressed", () => {
  it("requests that item's value", () => {
    onValueChange.mockReset();
    renderRoleGroup();

    press(screen.getByRole("radio", { name: /sitter/i }));

    expect(onValueChange).toHaveBeenCalledWith("sitter");
  });
});

describe("When an arrow key is pressed on a focused radio group item", () => {
  it("moves the selection to the next item", () => {
    onValueChange.mockReset();
    renderRoleGroup();

    fireEvent.keyDown(screen.getByRole("radio", { name: /pet parent/i }), { key: "ArrowDown" });

    expect(onValueChange).toHaveBeenCalledWith("sitter");
  });

  it("wraps from the first item back to the last", () => {
    onValueChange.mockReset();
    renderRoleGroup();

    fireEvent.keyDown(screen.getByRole("radio", { name: /pet parent/i }), { key: "ArrowUp" });

    expect(onValueChange).toHaveBeenCalledWith("both");
  });

  it("ignores keys that are not arrows", () => {
    onValueChange.mockReset();
    renderRoleGroup();

    fireEvent.keyDown(screen.getByRole("radio", { name: /pet parent/i }), { key: "Enter" });

    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe("When a radio group is disabled", () => {
  it("ignores presses on every item", () => {
    onValueChange.mockReset();
    render(
      <RadioGroup isDisabled onValueChange={onValueChange} value="parent">
        <RadioGroupItem label="Pet parent" value="parent" />
        <RadioGroupItem label="Sitter" value="sitter" />
      </RadioGroup>,
    );

    press(screen.getByRole("radio", { name: /sitter/i }));

    expect(onValueChange).not.toHaveBeenCalled();
  });
});
