import type { Urgency } from "@atlure/types";

import type { BadgeVariantProps } from "../../variants/badge-variants";
import { Badge, type BadgeProps } from "./badge";

type BadgeVariant = NonNullable<BadgeVariantProps["variant"]>;

export const urgencyBadgeVariant: Record<Urgency, BadgeVariant> = {
  low: "secondary",
  medium: "warning",
  high: "destructive",
};

export const DEFAULT_URGENCY_LABELS: Record<Urgency, string> = {
  low: "Low priority",
  medium: "Normal",
  high: "High priority",
};

export interface UrgencyBadgeProps extends Omit<BadgeProps, "label" | "variant"> {
  urgency: Urgency;
  label?: string;
}

export function UrgencyBadge({ urgency, label, ...badgeProps }: UrgencyBadgeProps) {
  return (
    <Badge
      variant={urgencyBadgeVariant[urgency]}
      label={label ?? DEFAULT_URGENCY_LABELS[urgency]}
      {...badgeProps}
    />
  );
}
