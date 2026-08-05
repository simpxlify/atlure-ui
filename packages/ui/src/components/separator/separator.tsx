import type { ComponentRef, Ref } from "react";
import { View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import { separatorVariants, type SeparatorVariantProps } from "../../variants/separator-variants";

export interface SeparatorProps extends Omit<ViewProps, "children"> {
  orientation?: NonNullable<SeparatorVariantProps["orientation"]>;
  spacing?: NonNullable<SeparatorVariantProps["spacing"]>;
  ref?: Ref<ComponentRef<typeof View>>;
}

export function Separator({
  orientation = "horizontal",
  spacing = "none",
  className,
  ...viewProps
}: SeparatorProps) {
  return (
    <View
      accessibilityRole="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={cn(separatorVariants({ orientation, spacing }), className)}
      {...viewProps}
    />
  );
}
