---
id: "014"
title: Build @atlure/types with the corrected domain model
repo: atlure-ui
epic: ds-foundations
priority: P0
size: M
serialize: "Yes"
milestone: M1
blocked_by: "013 Scaffold the atlure-ui pnpm workspace with pinned dependencies"
labels: "epic:ds-foundations; type:package; serialize"
---

# Build @atlure/types with the corrected domain model

## Context

`@atlure/types` is the zero-dependency domain model shared by all four repos. The prototype's types are demo-grade: `Pet.age` and `Pet.distance` are strings (`"0.2 mi"`), `rate` is a bare number with no currency, `breed` falls back to `type`, and `selectedSitter` is typed `any`. Atlure is EU-wide and multi-currency, so `Money` must carry currency from day one and distances must be numeric metres.

## Scope

Create `packages/types` publishing `@atlure/types`, pure `.ts` types and small helpers, no runtime dependencies.

- `Money { amount: number; currency: CurrencyCode }` where `amount` is minor units (integer cents) and `CurrencyCode` is a closed union of EU currencies plus `GBP`.
- `Role = "pet-parent" | "pet-sitter"` — one account, switchable.
- `Pet` with `birthDate: string` (ISO date) not `age: string`, `species: PetSpecies`, `breed: string | null`, `photoUrl: string | null`.
- `Coordinates { lat: number; lng: number }` and `distanceMeters: number`.
- `Sitter`, `SitterService`, `ServiceKind = "dog-walking" | "pet-sitting" | "home-boarding" | "home-sitting"`.
- `Booking`, `BookingStatus`, `ServiceRequest`, `Urgency = "low" | "medium" | "high"`.
- `Conversation`, `Message`, `Review`, `NotificationItem`, `HelpArticle`, `SupportTicket`.
- `Result<T>` — a discriminated union `{ ok: true; value: T } | { ok: false; code: ErrorCode; message: string }` with `ErrorCode` a **closed** union (`not-found`, `unauthenticated`, `forbidden`, `conflict`, `validation`, `rate-limited`, `network`, `unknown`). No transport type ever appears here.
- `Page<T> { items: T[]; nextCursor: string | null }` for cursor pagination.
- Barrel is generated, not hand-written — see ticket 020.

## Out of scope

Port interfaces (`SitterPort`, `BookingPort`) — those live in `atlure-paw` per ticket 063. Zod schemas. Any DB-generated Supabase types.

## Files you own

`packages/types/**`.

## Files you must NOT touch

`packages/tokens/**`. Any other package. `pnpm-lock.yaml` — this package has zero dependencies, so it must not change.

## Acceptance criteria

1. `pnpm --filter @atlure/types typecheck` exits 0.
2. `node -e "const p=require('./packages/types/package.json'); if(p.dependencies) process.exit(1)"` exits 0 — no runtime dependencies.
3. `grep -rn "age: string" packages/types/src` prints nothing, and `grep -rn "distance: string" packages/types/src` prints nothing.
4. `grep -rc "amount" packages/types/src/money.ts` is at least 1 and `Money` has a required `currency` field — a test asserting `const m: Money = { amount: 100 }` fails to typecheck, verified by `pnpm --filter @atlure/types test` including a `@ts-expect-error` case.
5. `git diff --exit-code pnpm-lock.yaml` exits 0.

## Blocked by

- 013 Scaffold the atlure-ui pnpm workspace with pinned dependencies
