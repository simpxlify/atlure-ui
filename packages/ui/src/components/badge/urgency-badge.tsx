import type { Urgency } from "@atlure/types";

import type { BadgeVariantProps } from "../../variants/badge-variants";
import { Badge, type BadgeProps } from "./badge";

type BadgeVariant = NonNullable<BadgeVariantProps["variant"]>;

export const urgencyBadgeVariant: Record<Urgency, BadgeVariant> = {
  low: "secondary",
  medium: "warning",
  high: "destructive",
};

export interface UrgencyBadgeProps extends Omit<BadgeProps, "label" | "variant"> {
  urgency: Urgency;
  label: string;
}

export function UrgencyBadge({ urgency, ...badgeProps }: UrgencyBadgeProps) {
  return <Badge variant={urgencyBadgeVariant[urgency]} {...badgeProps} />;
}
