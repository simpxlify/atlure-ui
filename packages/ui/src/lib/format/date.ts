export type DateStyle = "short" | "medium" | "long";

const millisecondsPerSecond = 1000;

const relativeThresholds: ReadonlyArray<{ unit: Intl.RelativeTimeFormatUnit; seconds: number }> = [
  { unit: "year", seconds: 60 * 60 * 24 * 365 },
  { unit: "month", seconds: 60 * 60 * 24 * 30 },
  { unit: "day", seconds: 60 * 60 * 24 },
  { unit: "hour", seconds: 60 * 60 },
  { unit: "minute", seconds: 60 },
];

export function formatDate(isoDateTime: string, locale: string, dateStyle: DateStyle = "medium") {
  return new Intl.DateTimeFormat(locale, { dateStyle }).format(new Date(isoDateTime));
}

export function formatDateRange(
  startIsoDateTime: string,
  endIsoDateTime: string,
  locale: string,
  dateStyle: DateStyle = "medium",
): string {
  return new Intl.DateTimeFormat(locale, { dateStyle }).formatRange(
    new Date(startIsoDateTime),
    new Date(endIsoDateTime),
  );
}

export function formatRelativeDate(
  isoDateTime: string,
  locale: string,
  now: Date = new Date(),
): string {
  const deltaSeconds =
    (new Date(isoDateTime).getTime() - now.getTime()) / millisecondsPerSecond;
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const magnitude = Math.abs(deltaSeconds);

  const threshold = relativeThresholds.find(({ seconds }) => magnitude >= seconds);

  if (threshold === undefined) {
    return formatter.format(Math.trunc(deltaSeconds), "second");
  }

  return formatter.format(Math.trunc(deltaSeconds / threshold.seconds), threshold.unit);
}
