import type { ComponentRef, ReactNode, Ref } from "react";
import type { Pressable, PressableProps } from "react-native";

import type { ControlSize } from "../../lib/touch-target";
import type { ButtonVariantProps } from "../../variants/button-variants";

export type ButtonVariant = NonNullable<ButtonVariantProps["variant"]>;
export type ButtonSize = Extract<ControlSize, "sm" | "md" | "lg">;

export interface PressableButtonProps
  extends Omit<PressableProps, "children" | "disabled" | "accessibilityState"> {
  variant?: ButtonVariant;
  isFullWidth?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
  ref?: Ref<ComponentRef<typeof Pressable>>;
}

export interface ButtonProps extends PressableButtonProps {
  label: string;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  labelClassName?: string;
}

export interface IconButtonProps extends PressableButtonProps {
  icon: ReactNode;
  accessibilityLabel: string;
}
