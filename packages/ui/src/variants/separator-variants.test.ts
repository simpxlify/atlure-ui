import { describe, expect, it } from "vitest";

import { separatorVariants } from "./separator-variants";

function widthClassOf(resolved: string): string | undefined {
  return resolved.split(" ").find((candidate) => candidate.startsWith("w-"));
}

describe("When a separator orientation is resolved", () => {
  it("draws a horizontal rule one pixel tall across the full width", () => {
    const resolved = separatorVariants({ orientation: "horizontal" });

    expect(resolved).toContain("h-px");
    expect(resolved).toContain("w-full");
  });

  it("draws a vertical rule one pixel wide stretched to its row", () => {
    const resolved = separatorVariants({ orientation: "vertical" });

    expect(resolved).toContain("w-px");
    expect(resolved).toContain("self-stretch");
  });

  it("resolves a different width class per orientation", () => {
    const horizontalWidth = widthClassOf(separatorVariants({ orientation: "horizontal" }));
    const verticalWidth = widthClassOf(separatorVariants({ orientation: "vertical" }));

    expect(horizontalWidth).toBe("w-full");
    expect(verticalWidth).toBe("w-px");
    expect(horizontalWidth).not.toBe(verticalWidth);
  });

  it("defaults to horizontal", () => {
    expect(separatorVariants({})).toBe(separatorVariants({ orientation: "horizontal" }));
  });
});

describe("When separator spacing is resolved", () => {
  it("takes its margin from the spacing scale", () => {
    expect(separatorVariants({ spacing: "sm" })).toContain("my-sm");
    expect(separatorVariants({ spacing: "md" })).toContain("my-md");
    expect(separatorVariants({ spacing: "none" })).not.toContain("my-");
  });
});
