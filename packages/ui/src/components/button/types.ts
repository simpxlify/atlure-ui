import type { ReactNode } from "react";
import type { PressableProps } from "react-native";

import type { ControlSize } from "../../lib/touch-target";
import type { ButtonVariantProps } from "../../variants/button-variants";

export type ButtonSize = Extract<ControlSize, "sm" | "md" | "lg">;

export interface ButtonProps
  extends Omit<PressableProps, "children" | "disabled" | "accessibilityState"> {
  label: string;
  variant?: NonNullable<ButtonVariantProps["variant"]>;
  size?: ButtonSize;
  isFullWidth?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  className?: string;
  labelClassName?: string;
}
