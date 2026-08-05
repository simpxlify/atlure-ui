import { cn } from "../../lib/cn";
import { textVariants, type TextVariantProps } from "../../variants/text-variants";

export interface TextClassNameInput extends TextVariantProps {
  inheritedClassName?: string | undefined;
  className?: string | undefined;
}

export function resolveTextClassName({
  variant,
  tone,
  inheritedClassName,
  className,
}: TextClassNameInput): string {
  return cn(textVariants({ variant, tone }), inheritedClassName, className);
}
