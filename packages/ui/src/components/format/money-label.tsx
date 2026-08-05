import type { Money } from "@atlure/types";

import { formatMoney, formatMoneyRate, type RateUnit } from "../../lib/format/money";
import { useLocale } from "../../lib/locale";
import { Text, type TextProps } from "../text/text";

export interface MoneyLabelProps extends Omit<TextProps, "children"> {
  value: Money;
  per?: RateUnit;
}

export function MoneyLabel({ value, per, ...textProps }: MoneyLabelProps) {
  const { locale } = useLocale();

  return (
    <Text {...textProps}>
      {per === undefined ? formatMoney(value, locale) : formatMoneyRate(value, locale, per)}
    </Text>
  );
}
