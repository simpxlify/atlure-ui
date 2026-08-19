import { Star, StarHalf } from "@atlure/icons";
import { Pressable, View, type ViewProps } from "react-native";

import { cn } from "../../lib/cn";
import { touchTargetHitSlopForSize } from "../../lib/touch-target";
import {
  starRatingClassName,
  starRatingEmptyClassName,
  starRatingFilledClassName,
  starRatingIconSize,
  starRatingValueVariants,
  type StarRatingSize,
} from "../../variants/star-rating-variants";
import { Text } from "../text/text";

const halfStep = 0.5;

export type StarFill = "full" | "half" | "empty";

export function starFillAt(starNumber: number, value: number): StarFill {
  if (value >= starNumber) {
    return "full";
  }

  return value >= starNumber - halfStep ? "half" : "empty";
}

export interface StarRatingProps extends Omit<ViewProps, "children"> {
  value: number | null;
  max?: number;
  size?: StarRatingSize;
  showValue?: boolean;
  count?: number;
  isInteractive?: boolean;
  onChange?: (value: number) => void;
  rateAccessibilityLabel?: (starNumber: number, max: number) => string;
}

export function StarRating({
  value,
  max = 5,
  size = "md",
  showValue = false,
  count,
  isInteractive = false,
  onChange,
  rateAccessibilityLabel = (starNumber, total) => `Rate ${starNumber} out of ${total}`,
  accessibilityLabel,
  className,
  ...viewProps
}: StarRatingProps) {
  const starNumbers = Array.from({ length: max }, (_, index) => index + 1);
  const pixelSize = starRatingIconSize[size];
  const hasValue = value !== null;
  const effectiveValue = hasValue ? value : 0;
  const showCount = hasValue && typeof count === "number" && count >= 0;

  return (
    <View
      accessibilityLabel={accessibilityLabel ?? (hasValue ? `${value} out of ${max}` : "Not rated")}
      className={cn(starRatingClassName, className)}
      {...viewProps}
    >
      {starNumbers.map((starNumber) => {
        const fill = starFillAt(starNumber, effectiveValue);
        const isPainted = fill !== "empty";
        const StarGlyph = fill === "half" ? StarHalf : Star;

        const glyph = (
          <StarGlyph
            className={isPainted ? starRatingFilledClassName : starRatingEmptyClassName}
            fill={isPainted ? "currentColor" : "none"}
            size={pixelSize}
          />
        );

        if (!isInteractive) {
          return (
            <View key={starNumber} testID={`star-${fill}`}>
              {glyph}
            </View>
          );
        }

        return (
          <Pressable
            key={starNumber}
            accessibilityRole="button"
            accessibilityLabel={rateAccessibilityLabel(starNumber, max)}
            hitSlop={touchTargetHitSlopForSize(pixelSize)}
            onPress={() => onChange?.(starNumber)}
            testID={`star-${fill}`}
          >
            {glyph}
          </Pressable>
        );
      })}
      {showValue && hasValue ? (
        <Text className={starRatingValueVariants({ size })}>{value.toFixed(1)}</Text>
      ) : null}
      {showCount ? (
        <Text className={starRatingValueVariants({ size })}>{`(${count})`}</Text>
      ) : null}
    </View>
  );
}
