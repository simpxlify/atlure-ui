import { useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";

import {
  formatHourLabel,
  formatTimeValue,
  isLocaleHour12,
  padTwoDigits,
  parseTimeValue,
} from "../../lib/calendar";
import { cn } from "../../lib/cn";
import { useLocale } from "../../lib/locale";
import {
  timePickerBodyClassName,
  timePickerColumnClassName,
  timePickerOptionClassName,
  timePickerOptionLabelClassName,
  timePickerOptionSelectedClassName,
} from "../../variants/calendar-variants";
import { Sheet } from "../sheet/sheet";
import { Text } from "../text/text";

export interface TimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  value?: string;
  onChange: (value: string) => void;
  minuteStep?: number;
  hour12?: boolean;
  bottomInset?: number;
  accessibilityLabel: string;
  backdropAccessibilityLabel: string;
  hourColumnAccessibilityLabel?: string;
  minuteColumnAccessibilityLabel?: string;
}

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;

export function TimePicker({
  isOpen,
  onClose,
  value,
  onChange,
  minuteStep = 15,
  hour12,
  bottomInset,
  accessibilityLabel,
  backdropAccessibilityLabel,
  hourColumnAccessibilityLabel = "Hour",
  minuteColumnAccessibilityLabel = "Minute",
}: TimePickerProps) {
  const { locale } = useLocale();
  const useHour12 = hour12 ?? isLocaleHour12(locale);

  const parsed = value !== undefined ? parseTimeValue(value) : undefined;
  const selectedHour = parsed?.hour;
  const selectedMinute = parsed?.minute;

  const hours = useMemo(() => Array.from({ length: HOURS_IN_DAY }, (_, i) => i), []);
  const minutes = useMemo(
    () =>
      Array.from({ length: Math.ceil(MINUTES_IN_HOUR / minuteStep) }, (_, i) => i * minuteStep),
    [minuteStep],
  );

  const emit = (hour: number, minute: number) => onChange(formatTimeValue(hour, minute));

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      accessibilityLabel={accessibilityLabel}
      backdropAccessibilityLabel={backdropAccessibilityLabel}
      bottomInset={bottomInset}
    >
      <View className={timePickerBodyClassName}>
        <ScrollView
          accessibilityLabel={hourColumnAccessibilityLabel}
          className={timePickerColumnClassName}
        >
          {hours.map((hour) => {
            const isActive = hour === selectedHour;
            return (
              <Pressable
                key={hour}
                accessibilityRole="button"
                accessibilityLabel={formatHourLabel(hour, useHour12, locale)}
                accessibilityState={{ selected: isActive }}
                aria-selected={isActive}
                onPress={() => emit(hour, selectedMinute ?? 0)}
                className={cn(
                  timePickerOptionClassName,
                  isActive && timePickerOptionSelectedClassName,
                )}
              >
                <Text className={timePickerOptionLabelClassName}>
                  {formatHourLabel(hour, useHour12, locale)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <ScrollView
          accessibilityLabel={minuteColumnAccessibilityLabel}
          className={timePickerColumnClassName}
        >
          {minutes.map((minute) => {
            const isActive = minute === selectedMinute;
            return (
              <Pressable
                key={minute}
                accessibilityRole="button"
                accessibilityLabel={padTwoDigits(minute)}
                accessibilityState={{ selected: isActive }}
                aria-selected={isActive}
                onPress={() => emit(selectedHour ?? 0, minute)}
                className={cn(
                  timePickerOptionClassName,
                  isActive && timePickerOptionSelectedClassName,
                )}
              >
                <Text className={timePickerOptionLabelClassName}>{padTwoDigits(minute)}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Sheet>
  );
}
