import { ChevronLeft, ChevronRight, iconSize } from "@atlure/icons";
import { useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";

import {
  addMonths,
  buildMonthGrid,
  firstDayOfWeek,
  formatFullDate,
  formatMonthLabel,
  formatWeekdayShort,
  isDateInRange,
} from "../../lib/calendar";
import { cn } from "../../lib/cn";
import { useLocale } from "../../lib/locale";
import {
  calendarContainerClassName,
  calendarDayCellClassName,
  calendarDayCellDisabledClassName,
  calendarDayCellInRangeClassName,
  calendarDayCellRangeEndClassName,
  calendarDayCellRangeStartClassName,
  calendarDayCellSelectedClassName,
  calendarDayLabelClassName,
  calendarDayLabelOutsideMonthClassName,
  calendarDayLabelSelectedClassName,
  calendarHeaderClassName,
  calendarMarkerDotClassName,
  calendarMonthLabelClassName,
  calendarNavButtonClassName,
  calendarWeekRowClassName,
  calendarWeekdayCellClassName,
  calendarWeekdayLabelClassName,
  calendarWeekdayRowClassName,
} from "../../variants/calendar-variants";
import { Text } from "../text/text";

export interface CalendarHighlight {
  start?: string;
  end?: string;
  inProgressStart?: string;
}

export interface CalendarProps {
  yearMonth: string;
  selected?: string;
  onSelect?: (iso: string) => void;
  onMonthChange?: (yearMonth: string) => void;
  disabledDates?: (iso: string) => boolean;
  minDate?: string;
  maxDate?: string;
  markers?: readonly string[];
  highlight?: CalendarHighlight;
  accessibilityLabel?: string;
  previousMonthAccessibilityLabel?: string;
  nextMonthAccessibilityLabel?: string;
  className?: string;
}

export function Calendar({
  yearMonth,
  selected,
  onSelect,
  onMonthChange,
  disabledDates,
  minDate,
  maxDate,
  markers,
  highlight,
  accessibilityLabel,
  previousMonthAccessibilityLabel = "Previous month",
  nextMonthAccessibilityLabel = "Next month",
  className,
}: CalendarProps) {
  const { locale } = useLocale();
  const [displayYearMonth, setDisplayYearMonth] = useState(yearMonth);

  useEffect(() => setDisplayYearMonth(yearMonth), [yearMonth]);

  const firstDow = useMemo(() => firstDayOfWeek(locale), [locale]);
  const weeks = useMemo(
    () => buildMonthGrid(displayYearMonth, firstDow),
    [displayYearMonth, firstDow],
  );
  const weekdayLabels = useMemo(
    () => Array.from({ length: 7 }, (_, i) => formatWeekdayShort((firstDow + i) % 7, locale)),
    [firstDow, locale],
  );
  const markerSet = useMemo(() => new Set(markers ?? []), [markers]);

  const changeMonth = (delta: number) => {
    const next = addMonths(displayYearMonth, delta);
    setDisplayYearMonth(next);
    onMonthChange?.(next);
  };

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      className={cn(calendarContainerClassName, className)}
    >
      <View className={calendarHeaderClassName}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={previousMonthAccessibilityLabel}
          className={calendarNavButtonClassName}
          onPress={() => changeMonth(-1)}
        >
          <ChevronLeft size={iconSize.md} />
        </Pressable>
        <Text className={calendarMonthLabelClassName}>
          {formatMonthLabel(displayYearMonth, locale)}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={nextMonthAccessibilityLabel}
          className={calendarNavButtonClassName}
          onPress={() => changeMonth(1)}
        >
          <ChevronRight size={iconSize.md} />
        </Pressable>
      </View>

      <View className={calendarWeekdayRowClassName}>
        {weekdayLabels.map((label, weekdayIndex) => (
          <View key={weekdayIndex} className={calendarWeekdayCellClassName}>
            <Text className={calendarWeekdayLabelClassName}>{label}</Text>
          </View>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} className={calendarWeekRowClassName}>
          {week.map((cell) => {
            const isDisabled =
              disabledDates?.(cell.iso) === true || !isDateInRange(cell.iso, minDate, maxDate);
            const isSelected = selected === cell.iso;
            const isRangeStart = highlight?.start === cell.iso;
            const isRangeEnd = highlight?.end === cell.iso;
            const isInProgressStart = highlight?.inProgressStart === cell.iso;
            const isInRange =
              highlight?.start !== undefined &&
              highlight.end !== undefined &&
              cell.iso > highlight.start &&
              cell.iso < highlight.end;
            const isHighlighted =
              isSelected || isRangeStart || isRangeEnd || isInProgressStart;
            const hasMarker = markerSet.has(cell.iso);

            return (
              <Pressable
                key={cell.iso}
                accessibilityRole="button"
                accessibilityLabel={formatFullDate(cell.iso, locale)}
                accessibilityState={{ disabled: isDisabled, selected: isHighlighted }}
                aria-disabled={isDisabled}
                aria-selected={isHighlighted}
                disabled={isDisabled}
                onPress={() => {
                  if (isDisabled) return;
                  onSelect?.(cell.iso);
                }}
                className={cn(
                  calendarDayCellClassName,
                  isInRange && calendarDayCellInRangeClassName,
                  isRangeStart && calendarDayCellRangeStartClassName,
                  isRangeEnd && calendarDayCellRangeEndClassName,
                  (isSelected || isInProgressStart) && calendarDayCellSelectedClassName,
                  isDisabled && calendarDayCellDisabledClassName,
                )}
              >
                <Text
                  className={cn(
                    calendarDayLabelClassName,
                    !cell.isCurrentMonth && calendarDayLabelOutsideMonthClassName,
                    isHighlighted && calendarDayLabelSelectedClassName,
                  )}
                >
                  {cell.dayNumber}
                </Text>
                {hasMarker && <View className={calendarMarkerDotClassName} />}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
