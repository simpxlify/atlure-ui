---
id: "113"
title: "Legal entity / KYC and VAT prerequisites for any monetization"
repo: admin
epic: monetization
priority: P3
size: M
serialize: "No"
milestone: M6
blocked_by: "112 Decision: commission via Stripe Connect versus flat sitter subscription"
labels: "epic:monetization; type:decision; needs:david; blocked:waiting-on-decision"
---

# Legal entity / KYC and VAT prerequisites for any monetization

## Context

Both monetization candidates share the same hard prerequisite: **a legal entity that can receive money, and KYC on that entity.** No payment provider removes that requirement, which is precisely why v1 takes no cut. This ticket collects the prerequisites so that whichever option ticket 112 chooses, the lead time on the paperwork is visible rather than discovered afterwards. It is tracked on the board because it takes weeks of calendar time and blocks any revenue.

## Scope

**This ticket requires David.** It is paperwork and professional advice, not engineering.

- Entity: jurisdiction, company type, registration timeline and cost. Note that jurisdiction affects both VAT treatment and which payment providers are available.
- Bank account and merchant account in the entity's name, with the expected KYC document list.
- Payment provider KYC on the entity, plus — for the commission option only — the per-sitter Connect onboarding and its own KYC burden.
- EU VAT: whether Atlure's fee is a B2B or B2C supply, the place-of-supply rules for a digital service across member states, whether OSS registration is needed, and the invoicing requirements. This differs per option: a sitter subscription and a transaction commission are treated differently.
- Data protection: whether the entity needs a DPO or an EU representative, and whether a DPA with Supabase is required and in place.
- Terms and privacy updates the entity change forces, feeding ticket 097.
- A dated timeline with the longest lead item identified.

## Out of scope

Any code. Choosing the monetization model — that is ticket 112. Tax filing itself.

## Files you own

`docs/legal-entity-prerequisites.md` in the admin notes.

## Files you must NOT touch

Any repo source. Any migration.

## Acceptance criteria

1. `docs/legal-entity-prerequisites.md` exists and names a chosen jurisdiction and company type with a rationale.
2. The document lists every KYC document required, by provider, with its current status (held or not held).
3. The document states the VAT treatment for the option chosen in ticket 112, including whether OSS registration is needed, and cites the rule relied on.
4. The document states whether a Supabase DPA is signed, with a date, and whether an EU representative or DPO is required.
5. The document contains a dated timeline identifying the longest lead item and the earliest possible first-revenue date.
6. Follow-up tickets exist for every terms and privacy change the entity requires, referencing ticket 097.
7. Professional advice on the VAT and entity questions has been obtained and is cited — this criterion is not satisfiable by an agent's own reasoning.

## Blocked by

- 112 Decision: commission via Stripe Connect versus flat sitter subscription
