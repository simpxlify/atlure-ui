import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Picker } from "./picker";

const SERVICE_OPTIONS = [
  { value: "boarding", label: "Boarding" },
  { value: "walking", label: "Walking" },
  { value: "grooming", label: "Grooming" },
] as const;

type Service = (typeof SERVICE_OPTIONS)[number]["value"];

async function renderPicker(values: readonly Service[] = []) {
  const onValuesChange = vi.fn();

  await act(async () => {
    render(
      <Picker
        options={SERVICE_OPTIONS}
        values={values}
        onValuesChange={onValuesChange}
        placeholder="Pick services"
        accessibilityLabel="Services"
        backdropAccessibilityLabel="Close"
      />,
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByRole("combobox", { name: "Services" }));
  });

  return onValuesChange;
}

async function pressOption(label: string) {
  await act(async () => {
    fireEvent.click(screen.getByRole("menuitem", { name: label }));
  });
}

describe("When a picker has no selection", () => {
  it("shows the placeholder on the trigger", async () => {
    await renderPicker();

    expect(screen.getAllByText("Pick services").length).toBeGreaterThan(0);
  });
});

describe("When options are selected", () => {
  it("reports an array holding the first pressed option", async () => {
    const onValuesChange = await renderPicker();

    await pressOption("Boarding");

    expect(onValuesChange).toHaveBeenCalledExactlyOnceWith(["boarding"]);
  });

  it("appends a second selection rather than replacing the first", async () => {
    const onValuesChange = await renderPicker(["boarding"]);

    await pressOption("Walking");

    expect(onValuesChange).toHaveBeenCalledExactlyOnceWith(["boarding", "walking"]);
    expect(onValuesChange.mock.lastCall?.[0]).toHaveLength(2);
  });

  it("keeps the sheet open so more options can be picked", async () => {
    await renderPicker();

    await pressOption("Boarding");

    expect(screen.getByRole("menuitem", { name: "Walking" })).toBeTruthy();
  });
});

describe("When a selected option is pressed again", () => {
  it("removes only that option from the reported array", async () => {
    const onValuesChange = await renderPicker(["boarding", "walking"]);

    await pressOption("Boarding");

    expect(onValuesChange).toHaveBeenLastCalledWith(["walking"]);
  });
});

describe("When a picker has selections", () => {
  it("marks them selected and lists their labels on the trigger", async () => {
    await renderPicker(["boarding", "grooming"]);

    expect(screen.getByRole("menuitem", { name: "Boarding" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("menuitem", { name: "Walking" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getAllByText("Boarding, Grooming").length).toBeGreaterThan(0);
  });
});
