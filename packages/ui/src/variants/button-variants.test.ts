import { controlHeight } from "@atlure/tokens";
import { describe, expect, it } from "vitest";

import { MIN_TOUCH_TARGET_SIZE, touchTargetHitSlop } from "../lib/touch-target";
import { buttonLabelVariants, buttonVariants } from "./button-variants";

const VARIANTS = ["primary", "secondary", "outline", "ghost", "destructive", "link"] as const;
const SIZES = ["sm", "md", "lg", "icon"] as const;

describe("When a button variant is resolved", () => {
  it("paints each variant from a colour token", () => {
    expect(buttonVariants({ variant: "primary" })).toContain("bg-primary");
    expect(buttonVariants({ variant: "destructive" })).toContain("bg-destructive");
    expect(buttonVariants({ variant: "secondary" })).toContain("bg-secondary");
    expect(buttonVariants({ variant: "outline" })).toContain("border-border/20");
    expect(buttonVariants({ variant: "ghost" })).toContain("bg-transparent");
    expect(buttonVariants({ variant: "link" })).toContain("bg-transparent");
  });

  it("gives every variant a label colour, because React Native does not inherit text style", () => {
    for (const variant of VARIANTS) {
      expect(buttonLabelVariants({ variant }), variant).toMatch(/text-[a-z-]+/);
    }
  });

  it("underlines the link variant rather than relying on hover, which native lacks", () => {
    expect(buttonLabelVariants({ variant: "link" })).toContain("underline");
    expect(buttonLabelVariants({ variant: "link" })).toContain("text-primary");
  });
});

describe("When a button size is resolved", () => {
  it("takes its height from the control-height token scale", () => {
    expect(buttonVariants({ size: "sm" })).toContain("h-control-sm");
    expect(buttonVariants({ size: "md" })).toContain("h-control-md");
    expect(buttonVariants({ size: "lg" })).toContain("h-control-lg");
    expect(buttonVariants({ size: "icon" })).toContain("h-control-icon");
  });

  it("keeps the icon size square", () => {
    const resolved = buttonVariants({ size: "icon" });

    expect(resolved).toContain("w-control-icon");
    expect(resolved).toContain("px-0");
  });

  it("reaches the minimum touch target on every size once hit slop is applied", () => {
    for (const size of SIZES) {
      const paddedHeight = controlHeight[size] + touchTargetHitSlop(size) * 2;

      expect(paddedHeight, `${size} resolves to ${paddedHeight}dp`).toBeGreaterThanOrEqual(
        MIN_TOUCH_TARGET_SIZE,
      );
    }
  });
});

describe("When the recipe is shared with the web package", () => {
  it("stays inside the React Native-safe Tailwind subset", () => {
    const everyClassString = [
      ...VARIANTS.flatMap((variant) => [
        buttonVariants({ variant }),
        buttonLabelVariants({ variant }),
      ]),
      ...SIZES.map((size) => buttonVariants({ size })),
    ].join(" ");

    expect(everyClassString).not.toMatch(/\bspace-[xy]-/);
    expect(everyClassString).not.toMatch(/\bdivide-/);
    expect(everyClassString).not.toMatch(/\bgrid\b/);
    expect(everyClassString).not.toMatch(/\binline-flex\b/);
  });

  it("sets flex-row explicitly, because React Native defaults to column", () => {
    expect(buttonVariants({})).toContain("flex-row");
  });
});
