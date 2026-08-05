import { spacing } from "@atlure/tokens";

export const iconSize = {
  sm: spacing.md,
  md: spacing.lg,
  lg: spacing.xl,
} as const;

export type IconSizeName = keyof typeof iconSize;

export type IconProps = {
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
};
