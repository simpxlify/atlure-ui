import { describe, expect, it } from "vitest";

import { cn } from "../lib/cn";
import { inputIconSlotVariants, inputVariants } from "./input-variants";
import { textareaVariants } from "./textarea-variants";

const SIZES = ["sm", "md", "lg"] as const;

describe("When an input is resolved", () => {
  it("takes its height from the control-height token scale on every size", () => {
    expect(inputVariants({ size: "sm" })).toContain("h-control-sm");
    expect(inputVariants({ size: "md" })).toContain("h-control-md");
    expect(inputVariants({ size: "lg" })).toContain("h-control-lg");
  });

  it("colours the placeholder from a token rather than a runtime lookup", () => {
    for (const size of SIZES) {
      expect(inputVariants({ size }), size).toContain("placeholder:text-muted-foreground");
    }
  });

  it("borders an invalid input in the destructive token", () => {
    expect(inputVariants({ isInvalid: true })).toContain("border-destructive");
    expect(inputVariants({ isInvalid: false })).toContain("border-border/20");
  });

  it("drops the fixed height once the control goes multiline", () => {
    const resolved = inputVariants({ isMultiline: true });

    expect(resolved).toContain("h-auto");
    expect(resolved).toContain("min-h-control-lg");
  });
});

describe("When an input carries an icon", () => {
  it("insets the text on the side that holds the icon", () => {
    expect(cn(inputVariants({ hasLeadingIcon: true }))).toContain("pl-3xl");
    expect(cn(inputVariants({ hasTrailingIcon: true }))).toContain("pr-3xl");
  });

  it("keeps the default padding when there is no icon", () => {
    const resolved = cn(inputVariants({}));

    expect(resolved).toContain("px-md");
    expect(resolved).not.toContain("pl-3xl");
    expect(resolved).not.toContain("pr-3xl");
  });

  it("pins each slot to its own edge", () => {
    expect(inputIconSlotVariants({ slot: "leading" })).toContain("left-md");
    expect(inputIconSlotVariants({ slot: "trailing" })).toContain("right-md");
  });

  it("lets a tap fall through the decorative leading slot to the field beneath", () => {
    expect(inputIconSlotVariants({ slot: "leading" })).toContain("pointer-events-none");
    expect(inputIconSlotVariants({ slot: "trailing" })).not.toContain("pointer-events-none");
  });
});

describe("When a textarea row count is resolved", () => {
  it("grows the minimum height with the row count", () => {
    expect(textareaVariants({ rows: 2 })).toContain("min-h-textarea-sm");
    expect(textareaVariants({ rows: 3 })).toContain("min-h-textarea-md");
    expect(textareaVariants({ rows: 4 })).toContain("min-h-textarea-lg");
    expect(textareaVariants({ rows: 6 })).toContain("min-h-textarea-xl");
  });
});
