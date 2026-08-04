---
id: "112"
title: "Decision: commission via Stripe Connect versus flat sitter subscription"
repo: admin
epic: monetization
priority: P2
size: M
serialize: "No"
milestone: M6
blocked_by: ""
labels: "epic:monetization; type:decision; needs:david; blocked:waiting-on-decision"
---

# Decision: commission via Stripe Connect versus flat sitter subscription

## Context

**There are no payments in v1.** Parents and sitters settle off-platform and Atlure takes no cut. That was a deliberate choice, not an omission: any payout to a third party requires a legal entity plus KYC, and no provider avoids that. This ticket exists so the two live candidates are written down and compared before code commits to either — the booking schema deliberately contains no payment columns so that this decision stays open.

## Scope

**This ticket requires David. It is a decision, not an implementation.**

Compare the two candidates on the same criteria and record the outcome:

**A. Commission via Stripe Connect.** Atlure processes the payment and takes a percentage. Requires a legal entity, KYC on Atlure, and onboarding every sitter through Connect with their own KYC. Revenue scales with volume. Increases regulatory and support surface substantially, and makes Atlure a party to every transaction, which changes the liability position stated in the terms (ticket 097).

**B. Flat sitter subscription.** Sitters pay a monthly fee to be listed or to receive requests; parents pay nothing and payment stays off-platform. Requires a legal entity and a merchant account, but no Connect onboarding and no payout flows. Revenue is predictable but caps at sitter count, and it must be charged through the app stores' in-app purchase rules if sold in-app, which takes a 15-30 per cent cut — selling it on the web instead has its own rules.

Criteria to score both against: time to first revenue, legal entity and KYC burden, app store policy exposure, effect on the terms and liability wording, EU VAT treatment across countries, effect on sitter acquisition, support load, and reversibility.

## Out of scope

Implementing either. Adding any payment column, table, dependency or UI. Choosing a payment provider before the model is chosen.

## Files you own

`docs/monetization-decision.md` in the admin notes.

## Files you must NOT touch

`atlure-api/supabase/migrations/**` — no payment columns until this is decided. `atlure-paw/src/screens/booking-request/**` (ticket 079) — it must stay payment-free.

## Acceptance criteria

1. `docs/monetization-decision.md` exists, scores both candidates against all eight named criteria, and states a chosen option with a date and a rationale.
2. The document names the legal entity requirement explicitly for the chosen option, and whether it is satisfied yet.
3. The document states the app store policy position for the chosen option, citing the relevant store rule.
4. The document states what the terms of service (ticket 097) must change to, if anything, and links a follow-up ticket for that edit.
5. A follow-up implementation ticket exists for the chosen option, with its own blockers listed, and is **not** started before this ticket closes.
6. `grep -riE "stripe|payment|payout" atlure-api/supabase/migrations atlure-paw/src` still prints nothing at the time this ticket closes — the decision has not leaked into code early.

## Blocked by

Nothing. Blocks ticket 113.
