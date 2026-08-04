# @atlure/types

The Atlure domain model. Shared by the Expo app, the marketing site and the backend so that one
definition of a `Booking` or a `Money` exists across the whole product.

Types only — zero runtime surface, zero dependencies. A test asserts the compiled module exports
nothing at runtime, so this package can never quietly grow logic.

## Every loose field from the prototype is tightened

The prototype's model used `string` for values that are not strings. Fixing that here, before 25
screens depend on it, avoids a migration later:

| Prototype | Here | Why |
|---|---|---|
| `age: string` | `birthDate: IsoDate \| null` | age is derived, not stored; it changes every year |
| `distance: string` | `distanceMeters: number` | formatting is a UI concern, and it must be sortable |
| `rate: number` | `Money { amountMinor, currency }` | the market is EU-wide and multi-currency; a bare number has no currency and floats lose cents |
| `image: string` | `imageUrl: string \| null` | absence is a real state the UI must handle |
| `serviceDays: string` | `window: DateRange` | two instants, not prose |
| `duration: string` | `durationMinutes: number` | comparable and computable |
| `type: string` | `species: PetSpecies` | a closed union, so a typo is a compile error |
| `serviceType: string` | `group: ServiceGroup` + `kind: ServiceKind` | the prototype conflated the two |

## Roles

A user holds **both** roles when they choose to. `User` has an optional `sitterProfile` and an
`activeRole` that toggles which mode the app is in — not a single fixed `role` field. Sitters are
frequently pet owners themselves, and a young marketplace needs that liquidity.

## Public versus private

`SitterProfile` is the owner's full view. `PublicSitterProfile` is the deliberately narrower shape
the marketing site renders on indexable pages: no contact details, no exact address, nothing from
the verification-documents bucket. Keeping them as separate types means an accidental leak on a
public page is a type error rather than a privacy incident.
