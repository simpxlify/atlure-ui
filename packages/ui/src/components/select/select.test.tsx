import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Select } from "./select";

const SPECIES_OPTIONS = [
  { value: "cat", label: "Cat" },
  { value: "dog", label: "Dog" },
  { value: "rabbit", label: "Rabbit", isDisabled: true },
] as const;

async function renderSelect(overrides: Partial<Parameters<typeof Select>[0]> = {}) {
  const onValueChange = vi.fn();

  await act(async () => {
    render(
      <Select
        options={SPECIES_OPTIONS}
        value={null}
        onValueChange={onValueChange}
        placeholder="Pick a species"
        accessibilityLabel="Species"
        backdropAccessibilityLabel="Close"
        {...overrides}
      />,
    );
  });

  return onValueChange;
}

async function openSheet() {
  await act(async () => {
    fireEvent.click(screen.getByRole("combobox", { name: "Species" }));
  });
}

describe("When a select has no value", () => {
  it("shows the placeholder and no options until it is opened", async () => {
    await renderSelect();

    expect(screen.getByText("Pick a species")).toBeTruthy();
    expect(screen.queryByRole("menuitem", { name: "Cat" })).toBeNull();
  });
});

describe("When a select has a value", () => {
  it("shows the matching option's label instead of the placeholder", async () => {
    await renderSelect({ value: "dog" });

    expect(screen.getByText("Dog")).toBeTruthy();
    expect(screen.queryByText("Pick a species")).toBeNull();
  });
});

describe("When a select is pressed", () => {
  it("opens a sheet listing every option and marks the trigger expanded", async () => {
    await renderSelect({ value: "cat" });

    await openSheet();

    expect(screen.getByRole("combobox", { name: "Species" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("menuitem", { name: "Cat" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("menuitem", { name: "Dog" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("menuitem", { name: "Rabbit" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});

describe("When an option is pressed", () => {
  it("reports the pressed option's value and closes the sheet", async () => {
    const onValueChange = await renderSelect();

    await openSheet();

    await act(async () => {
      fireEvent.click(screen.getByRole("menuitem", { name: "Dog" }));
    });

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("dog");
    expect(screen.queryByRole("menuitem", { name: "Dog" })).toBeNull();
  });
});

describe("When a select is disabled", () => {
  it("does not open the sheet", async () => {
    await renderSelect({ isDisabled: true });

    await openSheet();

    expect(screen.queryByRole("menuitem", { name: "Cat" })).toBeNull();
  });
});

describe("When a value outside the option union is passed", () => {
  it("fails to typecheck", async () => {
    await act(async () => {
      render(
        <Select
          options={SPECIES_OPTIONS}
          // @ts-expect-error "bird" is not one of the declared option values
          value="bird"
          onValueChange={vi.fn()}
          placeholder="Pick a species"
          accessibilityLabel="Species"
          backdropAccessibilityLabel="Close"
        />,
      );
    });

    expect(screen.getByText("Pick a species")).toBeTruthy();
  });
});
