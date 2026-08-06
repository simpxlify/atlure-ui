export type IsoDate = string;
export type YearMonth = string;

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const YEAR_MONTH_PATTERN = /^\d{4}-\d{2}$/;
const MS_PER_DAY = 86_400_000;

const SUNDAY_FIRST_REGIONS: ReadonlySet<string> = new Set([
  "US",
  "CA",
  "MX",
  "JP",
  "KR",
  "PH",
  "BR",
  "IL",
  "SA",
  "AE",
  "EG",
  "AU",
]);

export function parseIsoDate(iso: IsoDate): { year: number; month: number; day: number } {
  if (!ISO_DATE_PATTERN.test(iso)) {
    throw new Error(`Invalid ISO date: ${iso}`);
  }
  const parts = iso.split("-");
  return {
    year: Number(parts[0]),
    month: Number(parts[1]),
    day: Number(parts[2]),
  };
}

export function parseYearMonth(yearMonth: YearMonth): { year: number; month: number } {
  if (!YEAR_MONTH_PATTERN.test(yearMonth)) {
    throw new Error(`Invalid year-month: ${yearMonth}`);
  }
  const parts = yearMonth.split("-");
  return {
    year: Number(parts[0]),
    month: Number(parts[1]),
  };
}

export function toIsoDate(year: number, month: number, day: number): IsoDate {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function toYearMonth(year: number, month: number): YearMonth {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}`;
}

export function yearMonthOf(iso: IsoDate): YearMonth {
  const { year, month } = parseIsoDate(iso);
  return toYearMonth(year, month);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function dayOfWeek(iso: IsoDate): number {
  const { year, month, day } = parseIsoDate(iso);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function addMonths(yearMonth: YearMonth, delta: number): YearMonth {
  const { year, month } = parseYearMonth(yearMonth);
  const totalMonths = year * 12 + (month - 1) + delta;
  const nextYear = Math.floor(totalMonths / 12);
  const nextMonth = ((totalMonths % 12) + 12) % 12 + 1;
  return toYearMonth(nextYear, nextMonth);
}

export function daysBetween(startIso: IsoDate, endIso: IsoDate): number {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  const startUtc = Date.UTC(start.year, start.month - 1, start.day);
  const endUtc = Date.UTC(end.year, end.month - 1, end.day);
  return Math.round((endUtc - startUtc) / MS_PER_DAY);
}

export function firstDayOfWeek(locale: string): number {
  try {
    const loc = new Intl.Locale(locale);
    const info =
      (loc as unknown as { getWeekInfo?: () => { firstDay?: number } }).getWeekInfo?.() ??
      (loc as unknown as { weekInfo?: { firstDay?: number } }).weekInfo;
    if (info && typeof info.firstDay === "number") {
      return info.firstDay === 7 ? 0 : info.firstDay;
    }
    const region = loc.maximize().region;
    return region !== undefined && SUNDAY_FIRST_REGIONS.has(region) ? 0 : 1;
  } catch {
    return 1;
  }
}

export interface MonthGridCell {
  iso: IsoDate;
  dayNumber: number;
  isCurrentMonth: boolean;
}

export function buildMonthGrid(yearMonth: YearMonth, firstDow: number): MonthGridCell[][] {
  const { year, month } = parseYearMonth(yearMonth);
  const firstOfMonthDow = dayOfWeek(toIsoDate(year, month, 1));
  const leading = (firstOfMonthDow - firstDow + 7) % 7;
  const inThisMonth = daysInMonth(year, month);
  const totalCells = Math.ceil((leading + inThisMonth) / 7) * 7;

  const previousYearMonth = addMonths(yearMonth, -1);
  const { year: prevY, month: prevM } = parseYearMonth(previousYearMonth);
  const previousMonthDays = daysInMonth(prevY, prevM);
  const nextYearMonth = addMonths(yearMonth, 1);
  const { year: nextY, month: nextM } = parseYearMonth(nextYearMonth);

  const cells: MonthGridCell[] = [];
  for (let cellIndex = 0; cellIndex < totalCells; cellIndex++) {
    const offset = cellIndex - leading;
    if (offset < 0) {
      const day = previousMonthDays + offset + 1;
      cells.push({ iso: toIsoDate(prevY, prevM, day), dayNumber: day, isCurrentMonth: false });
    } else if (offset < inThisMonth) {
      const day = offset + 1;
      cells.push({ iso: toIsoDate(year, month, day), dayNumber: day, isCurrentMonth: true });
    } else {
      const day = offset - inThisMonth + 1;
      cells.push({ iso: toIsoDate(nextY, nextM, day), dayNumber: day, isCurrentMonth: false });
    }
  }

  const weeks: MonthGridCell[][] = [];
  for (let start = 0; start < cells.length; start += 7) {
    weeks.push(cells.slice(start, start + 7));
  }
  return weeks;
}

export function isDateInRange(iso: IsoDate, minDate?: IsoDate, maxDate?: IsoDate): boolean {
  if (minDate !== undefined && iso < minDate) return false;
  if (maxDate !== undefined && iso > maxDate) return false;
  return true;
}

export function formatMonthLabel(yearMonth: YearMonth, locale: string): string {
  const { year, month } = parseYearMonth(yearMonth);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1, 12, 0, 0)));
}

const SUNDAY_ANCHOR_UTC = Date.UTC(2024, 0, 7);

export function formatWeekdayShort(dayOfWeekIndex: number, locale: string): string {
  const date = new Date(SUNDAY_ANCHOR_UTC + dayOfWeekIndex * MS_PER_DAY);
  return new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(date);
}

export function formatFullDate(iso: IsoDate, locale: string): string {
  const { year, month, day } = parseIsoDate(iso);
  return new Intl.DateTimeFormat(locale, { dateStyle: "full", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, day, 12, 0, 0)),
  );
}

export function isLocaleHour12(locale: string): boolean {
  const parts = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "numeric",
    timeZone: "UTC",
  }).formatToParts(new Date(Date.UTC(2024, 0, 1, 13, 0, 0)));
  return parts.some((part) => part.type === "dayPeriod");
}

export function formatHourLabel(hour24: number, hour12Mode: boolean, locale: string): string {
  const date = new Date(Date.UTC(2024, 0, 1, hour24, 0, 0));
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    hour12: hour12Mode,
    timeZone: "UTC",
  }).format(date);
}

export function padTwoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatTimeValue(hour24: number, minute: number): string {
  return `${padTwoDigits(hour24)}:${padTwoDigits(minute)}`;
}

export function parseTimeValue(value: string): { hour: number; minute: number } | undefined {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (match === null) return undefined;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return undefined;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return undefined;
  return { hour, minute };
}
