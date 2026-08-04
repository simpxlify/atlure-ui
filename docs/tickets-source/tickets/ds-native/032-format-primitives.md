---
id: "032"
title: "MoneyLabel / DistanceLabel / DurationLabel and DateLabel"
repo: atlure-ui
epic: ds-native
priority: P0
size: M
serialize: "No"
milestone: M2
blocked_by: "027 Text primitive and the typography scale; 014 Build @atlure/types with the corrected domain model"
labels: "epic:ds-native; type:component; area:i18n"
---

# MoneyLabel / DistanceLabel / DurationLabel and DateLabel

## Context

Atlure launches EU-wide and multi-currency, so every price is a `Money` carrying its own currency, and every distance is metres, not the prototype's hard-coded strings like `"0.2 mi"` and bare `rate: 120`. Centralising formatting here is what stops 29 screen agents from each hand-rolling a currency symbol or a mile/kilometre choice. Locale comes from a context, not from each call site.

## Scope

- `LocaleProvider` and `useLocale()` in `packages/ui/src/lib/locale.tsx`, holding a BCP-47 locale string and a measurement system (`metric` default, `imperial` opt-in).
- `MoneyLabel` taking `value: Money` from `@atlure/types`, formatting minor units via `Intl.NumberFormat` with `style: "currency"` and the value's own currency — never a hard-coded symbol. Optional `per` suffix for rate display (`per hour`, `per night`, `per walk`).
- `DistanceLabel` taking `meters: number`, rendering metres under 1000 and kilometres above, one decimal place, respecting the measurement system.
- `DurationLabel` taking `minutes: number`, rendering compact human form (`45 min`, `1 h 30 min`).
- `DateLabel` and `DateRangeLabel` taking ISO strings, using `Intl.DateTimeFormat`, with a `relative` mode (`in 2 days`, `3 h ago`) via `Intl.RelativeTimeFormat`.
- All four render through `Text`, so typography variants and tones apply.
- Note that Hermes needs `Intl` enabled; document the `app.config.ts` requirement for ticket 058 rather than changing it here.

## Out of scope

Currency conversion or FX rates — each price is displayed in its own currency, never converted. Translation of UI copy; a full i18n message catalogue is out of scope for v1.

## Files you own

`packages/ui/src/lib/locale.tsx`, `packages/ui/src/components/money-label.tsx`, `distance-label.tsx`, `duration-label.tsx`, `date-label.tsx`, `apps/storybook-web/stories/Format.stories.tsx`.

## Files you must NOT touch

`packages/types/**` — `Money` and `CurrencyCode` are defined by ticket 014; report gaps there. `text.tsx`. `packages/ui/src/index.ts`.

## Acceptance criteria

1. `pnpm --filter @atlure/ui test` exits 0.
2. A test asserts `MoneyLabel` with `{ amount: 12000, currency: "EUR" }` under locale `de-DE` renders a string containing `120,00` and `€`, and under `en-IE` renders `€120.00`.
3. A test asserts the same amount with `currency: "GBP"` renders a `£` symbol — proving currency comes from the value, not the locale.
4. A test asserts `DistanceLabel meters={320}` renders `320 m` and `meters={12400}` renders `12.4 km`; with `imperial` it renders miles.
5. A test asserts `DurationLabel minutes={90}` renders a string containing both `1` and `30`.
6. `grep -rn '"€"\|"\$"\|"£"' packages/ui/src` prints nothing — no hard-coded currency symbols anywhere.

## Blocked by

- 014 Build @atlure/types with the corrected domain model
- 027 Text primitive and the typography scale
