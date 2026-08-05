import { formatDuration } from "../../lib/format/duration";
import { useLocale } from "../../lib/locale";
import { Text, type TextProps } from "../text/text";

export interface DurationLabelProps extends Omit<TextProps, "children"> {
  minutes: number;
}

export function DurationLabel({ minutes, ...textProps }: DurationLabelProps) {
  const { locale } = useLocale();

  return <Text {...textProps}>{formatDuration(minutes, locale)}</Text>;
}
