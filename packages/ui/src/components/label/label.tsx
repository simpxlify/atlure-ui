import { cn } from "../../lib/cn";
import { labelVariants } from "../../variants/label-variants";
import { Text, type TextProps } from "../text/text";

export interface LabelProps extends Omit<TextProps, "variant" | "tone"> {
  isDisabled?: boolean;
  isInvalid?: boolean;
}

export function Label({
  isDisabled = false,
  isInvalid = false,
  className,
  ...textProps
}: LabelProps) {
  return (
    <Text
      accessibilityRole="text"
      className={cn(labelVariants({ isDisabled, isInvalid }), className)}
      {...textProps}
    />
  );
}
