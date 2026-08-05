import { createContext, useContext, useMemo, type ReactNode } from "react";

import type { MeasurementSystem } from "./format/distance";

export interface LocalePreferences {
  locale: string;
  measurementSystem: MeasurementSystem;
}

export const defaultLocalePreferences: LocalePreferences = {
  locale: "en-IE",
  measurementSystem: "metric",
};

const LocaleContext = createContext<LocalePreferences>(defaultLocalePreferences);

export function LocaleProvider({
  locale,
  measurementSystem = "metric",
  children,
}: {
  locale: string;
  measurementSystem?: MeasurementSystem;
  children: ReactNode;
}) {
  const preferences = useMemo(() => ({ locale, measurementSystem }), [locale, measurementSystem]);

  return <LocaleContext.Provider value={preferences}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocalePreferences {
  return useContext(LocaleContext);
}

export type { MeasurementSystem };
export { LocaleContext };
