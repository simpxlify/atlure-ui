import type { EntityId, IsoDate } from "./common.js";

export type PetSpecies = "dog" | "cat" | "bird" | "rabbit" | "rodent" | "reptile" | "fish" | "other";

export type PetSize = "small" | "medium" | "large" | "giant";

export interface Pet {
  id: EntityId;
  ownerId: EntityId;
  name: string;
  species: PetSpecies;
  breed: string | null;
  birthDate: IsoDate | null;
  size: PetSize;
  imageUrl: string | null;
  notes: string | null;
  medicalNotes: string | null;
  isNeutered: boolean;
  isVaccinated: boolean;
}

export interface PetSummary {
  id: EntityId;
  name: string;
  species: PetSpecies;
  birthDate: IsoDate | null;
  imageUrl: string | null;
}
