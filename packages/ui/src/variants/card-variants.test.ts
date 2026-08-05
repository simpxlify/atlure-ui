import { describe, expect, it } from "vitest";

import { cardSectionVariants, cardVariants } from "./card-variants";

const VARIANTS = ["outlined", "elevated", "flat"] as const;

describe("When the default card is resolved", () => {
  it("paints the card surface and the translucent brand border from tokens", () => {
    const resolved = cardVariants({});

    expect(resolved).toContain("bg-card");
    expect(resolved).toContain("border-border/20");
  });

  it("rounds and clips its corners so media children cannot overflow them", () => {
    const resolved = cardVariants({});

    expect(resolved).toContain("rounded-lg");
    expect(resolved).toContain("overflow-hidden");
  });
});

describe("When a card variant is resolved", () => {
  it("keeps the card surface on every variant", () => {
    for (const variant of VARIANTS) {
      expect(cardVariants({ variant }), variant).toContain("bg-card");
    }
  });

  it("separates the variants by their border and shadow, not by their surface", () => {
    expect(cardVariants({ variant: "outlined" })).toContain("border-border/20");
    expect(cardVariants({ variant: "elevated" })).toContain("shadow-md");
    expect(cardVariants({ variant: "flat" })).toContain("border-transparent");
  });

  it("gives a pressable card a touchable minimum height", () => {
    expect(cardVariants({ isPressable: true })).toContain("min-h-control-lg");
    expect(cardVariants({ isPressable: false })).not.toContain("min-h-control-lg");
  });
});

describe("When a card section is resolved", () => {
  it("spaces every section from the spacing scale", () => {
    expect(cardSectionVariants({ section: "header" })).toContain("px-md");
    expect(cardSectionVariants({ section: "content" })).toContain("px-md");
    expect(cardSectionVariants({ section: "footer" })).toContain("px-md");
  });

  it("lays the footer out in a row, because React Native defaults to a column", () => {
    expect(cardSectionVariants({ section: "footer" })).toContain("flex-row");
  });
});
