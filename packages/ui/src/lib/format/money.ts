import type { Money } from "@atlure/types";

export type RateUnit = "hour" | "night" | "walk";

const fallbackCurrencyFractionDigits = 2;

function currencyFormatter(locale: string, currency: Money["currency"]): Intl.NumberFormat {
  return new Intl.NumberFormat(locale, { style: "currency", currency });
}

export function formatMoney(money: Money, locale: string): string {
  const formatter = currencyFormatter(locale, money.currency);
  const { maximumFractionDigits = fallbackCurrencyFractionDigits } = formatter.resolvedOptions();

  return formatter.format(money.amountMinor / 10 ** maximumFractionDigits);
}

export function formatMoneyRate(money: Money, locale: string, per: RateUnit): string {
  return `${formatMoney(money, locale)} per ${per}`;
}
