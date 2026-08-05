import type { ComponentRef, Ref } from "react";
import { View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import { cardSectionVariants } from "../../variants/card-variants";
import { Text, type TextProps } from "../text/text";

export interface CardSectionProps extends ViewProps {
  ref?: Ref<ComponentRef<typeof View>>;
}

export type CardTitleProps = Omit<TextProps, "variant">;

export type CardDescriptionProps = Omit<TextProps, "variant">;

export function CardHeader({ className, ...viewProps }: CardSectionProps) {
  return <View className={cn(cardSectionVariants({ section: "header" }), className)} {...viewProps} />;
}

export function CardTitle(textProps: CardTitleProps) {
  return <Text accessibilityRole="header" variant="h3" {...textProps} />;
}

export function CardDescription(textProps: CardDescriptionProps) {
  return <Text variant="bodySm" tone="muted" {...textProps} />;
}

export function CardContent({ className, ...viewProps }: CardSectionProps) {
  return (
    <View className={cn(cardSectionVariants({ section: "content" }), className)} {...viewProps} />
  );
}

export function CardFooter({ className, ...viewProps }: CardSectionProps) {
  return <View className={cn(cardSectionVariants({ section: "footer" }), className)} {...viewProps} />;
}
