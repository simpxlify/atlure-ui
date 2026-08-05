import { describe, expect, it } from "vitest";

import { toastMessageVariants, toastVariants } from "./toast-variants";

const VARIANTS = ["default", "success", "error"] as const;

describe("When a toast variant is resolved", () => {
  it("paints each variant from a colour token", () => {
    expect(toastVariants({ variant: "default" })).toContain("bg-card");
    expect(toastVariants({ variant: "success" })).toContain("bg-primary");
    expect(toastVariants({ variant: "error" })).toContain("bg-destructive");
  });

  it("gives every variant a message colour, because React Native does not inherit text style", () => {
    for (const variant of VARIANTS) {
      expect(toastMessageVariants({ variant })).toMatch(/text-/);
    }
  });

  it("lays the toast out as a row, since React Native defaults to column", () => {
    expect(toastVariants({})).toContain("flex-row");
  });
});
