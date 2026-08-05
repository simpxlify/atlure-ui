import { describe, expect, it } from "vitest";

import { resolveTextClassName } from "./utils";

describe("When a variant is resolved", () => {
  it("maps each step of the scale onto a preset size class", () => {
    expect(resolveTextClassName({ variant: "display" })).toContain("text-3xl");
    expect(resolveTextClassName({ variant: "h1" })).toContain("text-2xl");
    expect(resolveTextClassName({ variant: "h2" })).toContain("text-xl");
    expect(resolveTextClassName({ variant: "h3" })).toContain("text-lg");
    expect(resolveTextClassName({ variant: "body" })).toContain("text-base");
    expect(resolveTextClassName({ variant: "bodySm" })).toContain("text-sm");
    expect(resolveTextClassName({ variant: "label" })).toContain("font-medium");
    expect(resolveTextClassName({ variant: "caption" })).toContain("text-xs");
  });

  it("falls back to body when no variant is given", () => {
    expect(resolveTextClassName({})).toContain("text-base");
  });
});

describe("When a tone is resolved", () => {
  it("maps every tone onto a colour token rather than a literal colour", () => {
    expect(resolveTextClassName({ tone: "default" })).toContain("text-foreground");
    expect(resolveTextClassName({ tone: "muted" })).toContain("text-muted-foreground");
    expect(resolveTextClassName({ tone: "primary" })).toContain("text-primary");
    expect(resolveTextClassName({ tone: "destructive" })).toContain("text-destructive");
    expect(resolveTextClassName({ tone: "inverse" })).toContain("text-primary-foreground");
  });

  it("falls back to the foreground token, which is navy rather than black", () => {
    expect(resolveTextClassName({})).toContain("text-foreground");
  });
});

describe("When a colour arrives from more than one source", () => {
  it("lets an inherited class override the default tone", () => {
    const resolved = resolveTextClassName({ inheritedClassName: "text-primary-foreground" });

    expect(resolved).toContain("text-primary-foreground");
    expect(resolved).not.toContain("text-foreground ");
  });

  it("lets an explicit className win over an inherited class", () => {
    const resolved = resolveTextClassName({
      inheritedClassName: "text-primary-foreground",
      className: "text-destructive",
    });

    expect(resolved).toContain("text-destructive");
    expect(resolved).not.toContain("text-primary-foreground");
  });

  it("keeps the variant size when only the colour is inherited", () => {
    const resolved = resolveTextClassName({
      variant: "h1",
      inheritedClassName: "text-primary-foreground",
    });

    expect(resolved).toContain("text-2xl");
    expect(resolved).toContain("text-primary-foreground");
  });
});
