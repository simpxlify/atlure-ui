export type MeasurementSystem = "metric" | "imperial";

const metersPerKilometer = 1000;
const metersPerMile = 1609.344;

function unitFormatter(
  locale: string,
  unit: string,
  fractionDigits: number,
): Intl.NumberFormat {
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit,
    unitDisplay: "short",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatDistance(
  meters: number,
  locale: string,
  measurementSystem: MeasurementSystem,
): string {
  const distance = Math.max(0, meters);

  if (measurementSystem === "imperial") {
    return unitFormatter(locale, "mile", 1).format(distance / metersPerMile);
  }

  if (distance < metersPerKilometer) {
    return unitFormatter(locale, "meter", 0).format(distance);
  }

  return unitFormatter(locale, "kilometer", 1).format(distance / metersPerKilometer);
}
