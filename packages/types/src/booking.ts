import type { DateRange, EntityId, IsoDateTime, Money, Place } from "./common.js";
import type { PetSummary } from "./pet.js";
import type { ServiceGroup, ServiceKind } from "./service.js";

export type Urgency = "low" | "medium" | "high";

export type BookingStatus =
  | "draft"
  | "requested"
  | "accepted"
  | "declined"
  | "cancelled"
  | "in-progress"
  | "completed";

export interface PetRequest {
  id: EntityId;
  ownerId: EntityId;
  pets: PetSummary[];
  group: ServiceGroup;
  kind: ServiceKind;
  place: Place;
  window: DateRange;
  durationMinutes: number;
  offeredRate: Money;
  urgency: Urgency;
  description: string;
  status: BookingStatus;
  createdAt: IsoDateTime;
}

export interface HomeSittingRequest {
  id: EntityId;
  ownerId: EntityId;
  title: string;
  homeImageUrl: string | null;
  homeType: "apartment" | "house" | "studio" | "other";
  place: Place;
  window: DateRange;
  durationMinutes: number;
  offeredRate: Money;
  urgency: Urgency;
  description: string;
  pets: PetSummary[];
  amenities: string[];
  status: BookingStatus;
  createdAt: IsoDateTime;
}

export interface Booking {
  id: EntityId;
  requestId: EntityId;
  sitterId: EntityId;
  ownerId: EntityId;
  group: ServiceGroup;
  kind: ServiceKind;
  window: DateRange;
  agreedRate: Money;
  status: BookingStatus;
  createdAt: IsoDateTime;
}

export interface Review {
  id: EntityId;
  bookingId: EntityId;
  authorId: EntityId;
  subjectId: EntityId;
  score: number;
  body: string;
  createdAt: IsoDateTime;
}
