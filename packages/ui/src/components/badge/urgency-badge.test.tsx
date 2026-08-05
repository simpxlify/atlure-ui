import type { Urgency } from "@atlure/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { badgeVariants } from "../../variants/badge-variants";
import { UrgencyBadge, urgencyBadgeVariant } from "./urgency-badge";

describe("When an urgency badge renders", () => {
  it("paints high as destructive and low as secondary", () => {
    expect(badgeVariants({ variant: urgencyBadgeVariant.high })).toContain("bg-destructive");
    expect(badgeVariants({ variant: urgencyBadgeVariant.low })).toContain("bg-secondary");
    expect(badgeVariants({ variant: urgencyBadgeVariant.low })).not.toContain("bg-destructive");
  });

  it("paints medium as warning, which is neither of the other two", () => {
    expect(badgeVariants({ variant: urgencyBadgeVariant.medium })).toContain("bg-warning");
  });

  it("shows the caller's label", () => {
    render(<UrgencyBadge label="Needs a sitter today" urgency="high" />);

    expect(screen.getByText("Needs a sitter today")).toBeTruthy();
  });
});

describe("When the urgency union gains a member", () => {
  it("fails typecheck rather than silently defaulting", () => {
    const everyUrgency = Object.keys(urgencyBadgeVariant) as Urgency[];

    expect(everyUrgency).toEqual(["low", "medium", "high"]);

    // @ts-expect-error "critical" is not a member of Urgency, so the mapping cannot be indexed by it
    const unmapped = urgencyBadgeVariant["critical"];

    expect(unmapped).toBeUndefined();
  });
});
