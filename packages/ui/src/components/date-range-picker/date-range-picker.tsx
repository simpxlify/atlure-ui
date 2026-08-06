import { useState } from "react";
import { View } from "react-native";

import { daysBetween } from "../../lib/calendar";
import { cn } from "../../lib/cn";
import { formatDateRange, type DateStyle } from "../../lib/format/date";
import { useLocale } from "../../lib/locale";
import {
  dateRangePickerContainerClassName,
  dateRangePickerSummaryClassName,
} from "../../variants/calendar-variants";
import { Calendar } from "../calendar/calendar";
import { Text } from "../text/text";

export interface DateRange {
  start?: string;
  end?: string;
}

export interface DateRangePickerProps {
  yearMonth: string;
  onYearMonthChange?: (yearMonth: string) => void;
  range?: DateRange;
  onRangeChange: (range: { start: string; end: string }) => void;
  minNights?: number;
  maxNights?: number;
  disabledDates?: (iso: string) => boolean;
  minDate?: string;
  maxDate?: string;
  markers?: readonly string[];
  accessibilityLabel?: string;
  summaryAccessibilityLabel?: string;
  summaryDateStyle?: DateStyle;
  className?: string;
}

export function DateRangePicker({
  yearMonth,
  onYearMonthChange,
  range,
  onRangeChange,
  minNights,
  maxNights,
  disabledDates,
  minDate,
  maxDate,
  markers,
  accessibilityLabel,
  summaryAccessibilityLabel = "Selected date range",
  summaryDateStyle = "medium",
  className,
}: DateRangePickerProps) {
  const { locale } = useLocale();
  const [inProgressStart, setInProgressStart] = useState<string | undefined>(undefined);

  const handleSelect = (iso: string) => {
    if (inProgressStart === undefined) {
      setInProgressStart(iso);
      return;
    }

    setInProgressStart(undefined);

    const [start, end] =
      inProgressStart < iso ? [inProgressStart, iso] : [iso, inProgressStart];
    const nights = daysBetween(start, end);

    if (nights <= 0) return;
    if (minNights !== undefined && nights < minNights) return;
    if (maxNights !== undefined && nights > maxNights) return;

    onRangeChange({ start, end });
  };

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      className={cn(dateRangePickerContainerClassName, className)}
    >
      <Calendar
        yearMonth={yearMonth}
        onMonthChange={onYearMonthChange}
        onSelect={handleSelect}
        disabledDates={disabledDates}
        minDate={minDate}
        maxDate={maxDate}
        markers={markers}
        highlight={{
          start: range?.start,
          end: range?.end,
          inProgressStart,
        }}
      />
      {range?.start !== undefined && range.end !== undefined && (
        <Text
          accessibilityLabel={summaryAccessibilityLabel}
          className={dateRangePickerSummaryClassName}
        >
          {formatDateRange(range.start, range.end, locale, summaryDateStyle)}
        </Text>
      )}
    </View>
  );
}
