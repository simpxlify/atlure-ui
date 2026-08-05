import { formatDistance } from "../../lib/format/distance";
import { useLocale } from "../../lib/locale";
import { Text, type TextProps } from "../text/text";

export interface DistanceLabelProps extends Omit<TextProps, "children"> {
  meters: number;
}

export function DistanceLabel({ meters, ...textProps }: DistanceLabelProps) {
  const { locale, measurementSystem } = useLocale();

  return <Text {...textProps}>{formatDistance(meters, locale, measurementSystem)}</Text>;
}
