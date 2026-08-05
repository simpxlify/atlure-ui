import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Input } from "../input/input";
import { Textarea } from "../textarea/textarea";
import { FormField } from "./form-field";

describe("When a form field has a label", () => {
  it("names its control through the label, so the two share one id", () => {
    render(
      <FormField label="Email">
        <Input />
      </FormField>,
    );

    const control = screen.getByRole("textbox");

    expect(control).toHaveAccessibleName("Email");
    expect(control.getAttribute("aria-labelledby")).toBe(screen.getByText("Email").id);
  });
});

describe("When a form field has helper text and no error", () => {
  it("shows the helper text and leaves the control valid", () => {
    render(
      <FormField label="Email" helperText="We only use this for booking updates">
        <Input />
      </FormField>,
    );

    expect(screen.getByText("We only use this for booking updates")).toBeTruthy();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "false");
  });
});

describe("When a form field has an error", () => {
  it("replaces the helper text with the error and marks the control invalid", () => {
    render(
      <FormField label="Email" helperText="We only use this for booking updates" error="Required">
        <Input />
      </FormField>,
    );

    const control = screen.getByRole("textbox");

    expect(screen.getByText("Required")).toBeTruthy();
    expect(screen.queryByText("We only use this for booking updates")).toBeNull();
    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(control).toHaveAccessibleDescription("Required");
  });

  it("lets an explicit prop on the control override the field state", () => {
    render(
      <FormField label="Email" error="Required">
        <Input isInvalid={false} />
      </FormField>,
    );

    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "false");
  });
});

describe("When a form field is required", () => {
  it("marks the control required and keeps the visual asterisk out of its name", () => {
    render(
      <FormField label="Email" isRequired>
        <Input />
      </FormField>,
    );

    const control = screen.getByRole("textbox");

    expect(control).toHaveAttribute("aria-required", "true");
    expect(control).toHaveAccessibleName("Email");
  });
});

describe("When a form field is disabled", () => {
  it("disables the control it wraps", () => {
    render(
      <FormField label="About your pet" isDisabled>
        <Textarea />
      </FormField>,
    );

    expect(screen.getByRole("textbox")).toHaveAttribute("aria-disabled", "true");
  });
});
