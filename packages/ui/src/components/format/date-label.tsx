import {
  formatDate,
  formatDateRange,
  formatRelativeDate,
  type DateStyle,
} from "../../lib/format/date";
import { useLocale } from "../../lib/locale";
import { Text, type TextProps } from "../text/text";

export interface DateLabelProps extends Omit<TextProps, "children"> {
  value: string;
  dateStyle?: DateStyle;
  relative?: boolean;
}

export function DateLabel({ value, dateStyle = "medium", relative, ...textProps }: DateLabelProps) {
  const { locale } = useLocale();

  return (
    <Text {...textProps}>
      {relative === true ? formatRelativeDate(value, locale) : formatDate(value, locale, dateStyle)}
    </Text>
  );
}

export interface DateRangeLabelProps extends Omit<TextProps, "children"> {
  start: string;
  end: string;
  dateStyle?: DateStyle;
}

export function DateRangeLabel({
  start,
  end,
  dateStyle = "medium",
  ...textProps
}: DateRangeLabelProps) {
  const { locale } = useLocale();

  return <Text {...textProps}>{formatDateRange(start, end, locale, dateStyle)}</Text>;
}
