import type { DateRange, EntityId, IsoDateTime, Money, Place, Rating } from "./common.js";
import type { ServiceGroup } from "./service.js";

export type Role = "pet-parent" | "pet-sitter";

export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

export interface User {
  id: EntityId;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  place: Place | null;
  bio: string | null;
  phoneCountryCode: string | null;
  phoneNumber: string | null;
  createdAt: IsoDateTime;
  sitterProfile: SitterProfile | null;
  activeRole: Role;
}

export interface SitterProfile {
  id: EntityId;
  userId: EntityId;
  slug: string;
  professionalName: string;
  avatarUrl: string | null;
  headline: string;
  about: string;
  serviceGroups: ServiceGroup[];
  baseRate: Money;
  rating: Rating;
  verification: VerificationStatus;
  yearsOfExperience: number;
  responseTimeMinutes: number | null;
  acceptsSpecies: string[];
  availability: DateRange[];
  serviceCity: string | null;
  serviceCountryCode: string | null;
}

export interface SitterSummary {
  id: EntityId;
  slug: string;
  displayName: string;
  avatarUrl: string | null;
  headline: string;
  baseRate: Money;
  rating: Rating;
  verification: VerificationStatus;
  distanceMeters: number;
  serviceGroups: ServiceGroup[];
}

export interface PublicSitterProfile {
  slug: string;
  professionalName: string;
  avatarUrl: string | null;
  headline: string;
  about: string;
  serviceGroups: ServiceGroup[];
  baseRate: Money;
  rating: Rating;
  verification: VerificationStatus;
  yearsOfExperience: number;
  city: string;
  countryCode: string;
}

export interface Session {
  userId: EntityId;
  expiresAt: IsoDateTime;
}
