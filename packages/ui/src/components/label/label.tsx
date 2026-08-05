import { cn } from "../../lib/cn";
import { labelRequiredMarkerClassName, labelVariants } from "../../variants/label-variants";
import { Text, type TextProps } from "../text/text";

export interface LabelProps extends Omit<TextProps, "variant" | "tone"> {
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
}

export function Label({
  isDisabled = false,
  isInvalid = false,
  isRequired = false,
  className,
  children,
  ...textProps
}: LabelProps) {
  return (
    <Text
      accessibilityRole="text"
      className={cn(labelVariants({ isDisabled, isInvalid }), className)}
      {...textProps}
    >
      {children}
      {isRequired ? (
        <Text aria-hidden accessibilityElementsHidden className={labelRequiredMarkerClassName}>
          {" *"}
        </Text>
      ) : null}
    </Text>
  );
}
