import type { DateRange, EntityId, Money, Place } from "./common.js";
import type { PetSpecies } from "./pet.js";

export type ServiceGroup = "walk-sit" | "home-boarding";

export type ServiceKind =
  | "dog-walking"
  | "drop-in-visit"
  | "day-care"
  | "house-sitting"
  | "home-boarding";

export interface ServiceListing {
  id: EntityId;
  sitterId: EntityId;
  group: ServiceGroup;
  kind: ServiceKind;
  title: string;
  description: string;
  rate: Money;
  ratePeriod: "per-visit" | "per-hour" | "per-night" | "per-day";
  acceptsSpecies: PetSpecies[];
  place: Place;
  availability: DateRange[];
  isActive: boolean;
}

export interface SitterSearchQuery {
  group: ServiceGroup | null;
  kind: ServiceKind | null;
  centre: { latitude: number; longitude: number };
  radiusMeters: number;
  species: PetSpecies | null;
  dates: DateRange | null;
  maxRateMinor: number | null;
  minRating: number | null;
  cursor: string | null;
}
