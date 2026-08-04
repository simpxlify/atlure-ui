import { describe, expect, it } from "vitest";

import { cn } from "./cn";

describe("When merging class names", () => {
  it("lets a later control-height token override an earlier one", () => {
    expect(cn("h-control-md", "h-control-lg")).toBe("h-control-lg");
  });

  it("keeps unrelated token classes and drops falsy values", () => {
    expect(cn("bg-primary", false && "bg-muted", undefined, "px-md")).toBe("bg-primary px-md");
  });

  it("lets a caller override a variant colour", () => {
    expect(cn("bg-primary", "bg-destructive")).toBe("bg-destructive");
  });
});
