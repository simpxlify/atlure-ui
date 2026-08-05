const minutesPerHour = 60;

function unitFormatter(locale: string, unit: "hour" | "minute"): Intl.NumberFormat {
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit,
    unitDisplay: "short",
    maximumFractionDigits: 0,
  });
}

export function formatDuration(minutes: number, locale: string): string {
  const wholeMinutes = Math.max(0, Math.round(minutes));

  if (wholeMinutes < minutesPerHour) {
    return unitFormatter(locale, "minute").format(wholeMinutes);
  }

  const hours = Math.floor(wholeMinutes / minutesPerHour);
  const remainingMinutes = wholeMinutes % minutesPerHour;
  const formattedHours = unitFormatter(locale, "hour").format(hours);

  if (remainingMinutes === 0) {
    return formattedHours;
  }

  return `${formattedHours} ${unitFormatter(locale, "minute").format(remainingMinutes)}`;
}
