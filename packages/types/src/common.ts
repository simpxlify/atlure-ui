export type CurrencyCode =
  | "EUR"
  | "GBP"
  | "CHF"
  | "SEK"
  | "NOK"
  | "DKK"
  | "PLN"
  | "CZK"
  | "RON"
  | "HUF"
  | "BGN";

export interface Money {
  amountMinor: number;
  currency: CurrencyCode;
}

export type IsoDateTime = string;

export type IsoDate = string;

export interface DateRange {
  start: IsoDateTime;
  end: IsoDateTime;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Place {
  label: string;
  city: string;
  countryCode: string;
  coordinates: Coordinates;
}

export interface Rating {
  average: number;
  count: number;
}

export interface Page<TItem> {
  items: TItem[];
  nextCursor: string | null;
}

export type EntityId = string;
