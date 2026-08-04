# Atlure ticket board

113 tickets across 10 epics and 4 repos, authored from the approved plan (`~/.claude/plans/merry-petting-ladybug.md`) and the finalized prototype in `atlure-spec-reference`. Every ticket is written for an autonomous agent reading **only that one ticket** with zero other context.

- `MANIFEST.csv` — machine-readable, one row per ticket. Header: `id,title,repo,epic,priority,size,serialize,milestone,blocked_by,labels`. No field contains a comma; `labels` and `blocked_by` use `; ` as their internal separator. `id` always matches the ticket filename prefix. Titles were normalised to be comma-free (a comma inside a title became ` / `) so a naive CSV split cannot break.
- `tickets/<epic-slug>/<NNN>-<slug>.md` — the tickets. YAML frontmatter, then Context / Scope / Out of scope / Files you own / Files you must NOT touch / Acceptance criteria / Blocked by.
- `PROGRESS.md` — authoring checkpoints.

Validated: all 113 ids unique and matching filenames; every `blocked_by` id exists; every `blocked_by` title matches the referenced ticket's actual title; **no dependency cycles**.

## Board organisation

| Epic | Slug | Repo | Tickets | Ids |
|---|---|---|---|---|
| 0 · Salvage, decommission and external blockers | `decommission` | admin | 12 | 001-012 |
| 1 · DS foundations | `ds-foundations` | atlure-ui | 13 | 013-025 |
| 2 · `@atlure/ui` native components | `ds-native` | atlure-ui | 15 | 026-040 |
| 3 · `@atlure/ui-web` marketing components | `ds-web` | atlure-ui | 5 | 041-045 |
| 4 · Supabase schema, RLS, PostGIS, Realtime, Hono | `backend` | atlure-api | 12 | 046-057 |
| 5 · `atlure-paw` shell | `paw-shell` | atlure-paw | 8 | 058-065 |
| 6 · The 25 product screens | `paw-screens` | atlure-paw | 29 | 066-094 |
| 7 · Marketing site | `web-marketing` | atlure-web | 9 | 095-103 |
| 8 · Quality, observability, launch | `quality` | all | 8 | 104-111 |
| 9 · Monetization decision | `monetization` | admin | 2 | 112-113 |

By repo: `atlure-paw` 40, `atlure-ui` 34, admin 14, `atlure-api` 12, `atlure-web` 9, cross-repo 4.
By priority: P0 54, P1 41, P2 16, P3 2.
By milestone: M0 9, M1 11, M2 27, M3 13, M4 19, M5 27, M6 7.

### Where the counts differ from the plan

Two epics came out larger than the plan's estimate, both deliberately:

- **`decommission` is 12, not 6.** The six salvage and hygiene tickets are there, plus the six manual/external blockers the plan lists as pre-flight (gh project scope, npm org, EU Supabase project, bundle-id reservation, Vercel project). They are tracked as tickets because they block real work and none of them can be done by an agent.
- **`ds-native` is 15, not 14.** `Calendar` / `DateRangePicker` / `TimePicker` (040) is the largest component in the system and does not merge cleanly into any other ticket. Everything else was consolidated hard: 15 tickets cover roughly 40 components.
- **`ds-foundations` is 13, not 12** — the extra one is the published-tarball install smoke test (024), which is the gate that proves the `0.0.40` `exports` defect cannot recur.

## Labels

Mirror `Epic` as a label so agents can see it via `gh issue list` without project scope.

- `epic:decommission`, `epic:ds-foundations`, `epic:ds-native`, `epic:ds-web`, `epic:backend`, `epic:paw-shell`, `epic:paw-screens`, `epic:web-marketing`, `epic:quality`, `epic:monetization`
- `type:` — `scaffold`, `package`, `component`, `screen`, `schema`, `service`, `page`, `test`, `ci`, `tooling`, `architecture`, `navigation`, `auth`, `a11y`, `performance`, `observability`, `release`, `risk`, `decision`, `manual`, `hygiene`, `salvage`, `feature`
- `area:` — `tokens`, `nativewind`, `icons`, `forms`, `overlays`, `realtime`, `postgis`, `storage`, `security`, `release`, `npm`, `eas`, `vercel`, `supabase`, `stores`, `seo`, `maps`, `deeplinks`, `notifications`, `i18n`, `fixtures`, `brand`, `conflict-hotspot`, `storybook`
- `blocked:waiting-on-external`, `blocked:waiting-on-decision`, `needs:david`, `serialize`, `status:done`

`needs:david` marks the 10 tickets an agent cannot finish: 008, 009, 010, 011, 012, 097, 109, 111, 112, 113.

## Milestones

- **M0 — Don't lose anything** (9). Salvage, gitignore, npm org, EU Supabase project, identifiers, Vercel. Off the critical path but gets more expensive daily.
- **M1 — DS foundations green** (11). Workspace builds, token parity and checksum tests pass, and the release pipeline is proven by publishing `@atlure/tokens@0.1.0-alpha.0` before any component exists.
- **M2 — DS usable** (27). `Button` and `Card` render in Atlure orange, light and dark, from the *published* packages, in both a real Expo app and a real Next app.
- **M3 — Schema + seam** (13). Migrations, RLS verified adversarially, PostGIS radius search correct at 5 km and 20 km; ports + mock + Supabase adapter passing one shared conformance suite; auth working on device.
- **M4 — Thin slice** (19). Sign up → choose role → add a pet → search by radius → open a sitter profile → request a booking, on a real device against real Supabase. Marketing site live with legal pages.
- **M5 — Full product** (27). Remaining screens, messaging, live tracking, notifications, reviews, programmatic SEO.
- **M6 — Stores** (7). TestFlight + Play internal, a11y audit, brand assets, performance budgets.

## The critical path

Longest dependency chain, 14 tickets, weighted 93 size-points — this is what determines the ship date. Everything else can be parallelised around it.

```
010 EU Supabase project (M0, manual)
 └─ 046 atlure-api scaffold
     └─ 047 profiles / roles / pets schema
         └─ 048 sitter profiles / services / availability
             └─ 050 requests / bookings / status graph
                 └─ 051 messaging + realtime
                     └─ 054 RLS policies + adversarial suite
                         └─ 062 auth gate + role switching
                             └─ 065 Supabase adapter (conformance green)
                                 └─ 071 find a sitter (search + results)
                                     └─ 078 sitter public profile
                                         └─ 079 booking request + summary
                                             └─ 105 M4 e2e on a real device
                                                 └─ 111 store launch
```

Two implications worth acting on:

1. **Ticket 010 is manual and blocks the entire backend chain.** Nothing in `atlure-api` can start until the EU Supabase project exists, and the region cannot be changed later. Do it first.
2. **The schema chain 046→047→048→050→051→054 is all `serialize: Yes`** and all in one repo, so it is inherently sequential — six tickets, four of them L. This is the longest stretch with no parallelism available. Splitting 050 or 051 further would create migration-ordering conflicts, so the sequence is intentional.

## Parallel-safe fan-out points

These are the tickets that unblock the most work. Landing them promptly is what keeps agents busy.

| Ticket | Unblocks | Why it matters |
|---|---|---|
| 033 Input / Textarea / Label / FormField / SearchBar | 8 | Every form screen and the search entry point |
| 039 Skeleton / Spinner / EmptyState / ErrorState / ListRow | 8 | The prototype has **no** loading, error or empty states; every screen needs all three |
| 018 `@atlure/ui` scaffold | 7 | Nothing native can be built before the source-shipping package exists |
| 027 `Text` | 7 | Every other component depends on it; RN has no style inheritance |
| 062 Auth gate | 7 | Every authenticated screen |
| 095 `atlure-web` scaffold | 7 | The entire marketing epic |
| 013 Workspace scaffold | 6 | Front-loads every dependency so nothing else touches the lockfile |
| 019 `@atlure/ui-web` scaffold | 6 | The whole `ds-web` epic |
| 065 Supabase adapter | 6 | Every screen that reads real data |

**Startable right now with zero blockers:** 001 (done), 002 (done), 008, 009, 010, 011, 109, 112. Six of those eight need David — that is the honest shape of the immediate bottleneck.

**Widest genuinely parallel band:** once 018 and 027 land, tickets 028-040 (13 component tickets) are all `serialize: No` and own disjoint files. Similarly, once 065 lands, the screen tickets fan out to roughly 8-10 concurrent lanes. Cap work-in-flight around 6 regardless — review capacity, not agent availability, is the bottleneck.

## Serialized tickets — never run two concurrently

27 tickets carry `serialize: Yes`: 013, 014, 017, 018, 019, 020, 021, 022, 046-054, 058-060, 062-065, 095, 101, 111.

They fall into three groups:

- **Package scaffolds and the release pipeline** (013-022) — each creates the files the next one extends.
- **Migrations** (046-054) — `supabase/migrations/` is append-only and order-dependent; two concurrent tickets produce an unapplicable sequence.
- **Repo shells** (058-060, 062-065, 095, 101) — they define the interfaces every later ticket consumes.

## Conflict hotspots and how each is neutralised

Every ticket carries a "Files you must NOT touch" section because agents run in parallel. Six files would otherwise be rewritten by dozens of agents:

| Hotspot | Mitigation | Owning ticket |
|---|---|---|
| `packages/tokens/src/tokens.ts` | Written by the lead, then **frozen**. A lint rule bans raw hex everywhere else, removing any reason to reopen it. | 016 (lint), lead (source) |
| `packages/tailwind-preset/*` | Fully generated. Component tickets extend via `className` only and are told so explicitly. | 017 |
| Barrel `index.ts` files | **Generated from a glob** at build time, so the conflict is removed rather than managed. No ticket may hand-edit one after 020. Also fixes the predecessor's 2-of-32-exports bug. | 020 |
| Mock fixtures | **One file per entity, mandated.** A combined `fixtures.ts` is asserted not to exist. Screen tickets add files, never edit existing ones. | 064 |
| Navigation config | Landed **complete upfront** with every route `coming-soon`. Each screen ticket flips one word on one line in `routes.ts`, so git merges cleanly. Screen tickets may not add, move or rename a route file. | 059 |
| `app/sitemap.ts` / `robots.ts` | Pages **register** their URLs in a route registry; the sitemap reads the registry. No page ticket edits either file. | 101 |
| `pnpm-lock.yaml` | Dependencies front-loaded in scaffold tickets; new deps are declared on the ticket, not added ad hoc. | 013, 046, 058, 095 |

## The unverified risk

**Ticket 061 is the highest-risk unknown on the project and is P0.** NativeWind 4.2.6 declares no React Native or Expo peer constraint — its only peer is `tailwindcss` — so compatibility with Expo 57.0.10 / RN 0.86.2 is unproven by metadata. NativeWind 5 is preview-only and needs Tailwind above 4.1.11, so it is not an option. The failure mode is silent: when the Babel transform does not apply, `className` becomes a dead prop and every component renders unstyled with no error. A passing typecheck, a passing unit test and a correct Storybook render all prove nothing.

Acceptance is a pixel sample from a **physical device** on a **release** build: `bg-primary` must be within 5 per channel of `#ea580c`, in both light and dark, on iOS and Android. Documented fallback is Expo 56.0.18, with follow-up tickets to re-pin the other repos.

## Honest notes on this ticket set

**Tickets I expect to be cut or rewritten:**

- **072 Map screen** and **087 Live tracking** — both depend on `react-native-maps` with Google Maps, which needs per-platform API keys and native config. If the maps setup proves painful, 072 is the most cuttable screen in the set (search already works as a list) and 087 could ship as a status feed without a map. 087 also explicitly defers background location, which is the feature users will actually ask for.
- **069 Onboarding + coach marks** — pure polish, P2, no dependency on it. First thing to cut if M5 runs long.
- **094 Help & support + refer a friend** — the referral reward copy is a placeholder because monetization is undecided (112). If 112 chooses a subscription model, the referral half of this ticket needs rewriting.
- **079 Booking request** will be rewritten when monetization lands. It is deliberately payment-free and asserts the absence of payment fields; whichever model 112 picks turns that into a real flow.
- **098 Programmatic city pages** is the ticket most likely to be split. Nine acceptance criteria on one L ticket covering templating, ISR, thin-content gating and structured data is a lot; if it stalls, split the thin-content guard and the structured data into their own tickets.
- **091's settings list** assumes the prototype's six `onNavigate` destinations survive with payment replaced by booking history. If the profile IA changes, 091 changes.

**Acceptance criteria I could not make fully mechanical:**

- **061 (NativeWind on device)**, **103 (universal links)**, **108 (push delivery)**, **111 (store submission)** — each requires a physical device or a store console. Criteria specify the exact observation and demand an attached screenshot or recording, but a human has to perform it. This is inherent, not a gap.
- **097 (legal pages)** — the operative legal text cannot be verified by a test. The mitigation is a build-time placeholder marker that fails a production build until reviewed text replaces it, which makes "unreviewed" mechanically detectable even though "correct" is not.
- **109 (brand assets)** — "no image contains the pawlii wordmark" is only partly checkable. Filename and text greps are asserted; the visual check is human.
- **107 (a11y audit)** — the automated half is fully mechanical (`axe` at zero, contrast, hit targets, dynamic type). The VoiceOver and TalkBack pass is not, and is specified as a recorded manual step.
- **113 (legal entity / VAT)** — one criterion explicitly states it cannot be satisfied by an agent's own reasoning; it needs professional advice.
- **096's "no near-duplicate copy"** and **098's paragraph-similarity threshold** are the weakest mechanical criteria in the set. A similarity threshold is a proxy for editorial quality and will need tuning to be useful rather than annoying.
- **110 (performance budgets)** sets ceilings without baselines, because the baselines do not exist yet. The first run establishes them; expect one follow-up commit adjusting the numbers with a stated reason.

**Things the plan settled that these tickets enforce mechanically, worth knowing about:**

- No payment anywhere in v1: several tickets assert `grep` for payment wording returns nothing (050, 075, 079, 112).
- No raw hex outside `tokens.ts` (016), and no hard-coded currency symbols anywhere (032).
- Dark `primary` must stay orange — the prototype set it to `#f1f5f9` and lost the brand (015, 045, 061).
- `NAV_THEME` must carry `fonts`, which the salvaged version omitted (015, 060).
- No `PostgrestError` outside one file (065); no `@supabase/supabase-js` import under `app/` or `src/screens/` (063).
- Nothing in `@atlure/*` may hardcode "paw" — a future `com.atlure.scoop` reuses the same packages.
