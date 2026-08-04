import { View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import { cardSectionVariants } from "../../variants/card-variants";

export interface CardSectionProps extends ViewProps {}

export function CardHeader({ className, ...viewProps }: CardSectionProps) {
  return <View className={cn(cardSectionVariants({ section: "header" }), className)} {...viewProps} />;
}

export function CardContent({ className, ...viewProps }: CardSectionProps) {
  return (
    <View className={cn(cardSectionVariants({ section: "content" }), className)} {...viewProps} />
  );
}

export function CardFooter({ className, ...viewProps }: CardSectionProps) {
  return <View className={cn(cardSectionVariants({ section: "footer" }), className)} {...viewProps} />;
}
