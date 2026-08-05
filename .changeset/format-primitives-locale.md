---
"@atlure/ui": minor
---

Add locale-aware format primitives and their label components.

`LocaleProvider` / `useLocale()` carry a BCP-47 locale and a measurement system (`metric` default,
`imperial` opt-in). `MoneyLabel`, `DistanceLabel`, `DurationLabel`, `DateLabel` and `DateRangeLabel`
render through `Text`, so typography variants and tones still apply.

Every symbol, unit, separator and date order comes from `Intl` rather than a literal: a price renders
in its own currency regardless of the reader's locale, minor-unit decimal places are read back from
`Intl` per currency instead of assumed to be two, and distances follow the active measurement system.
`@atlure/ui` now depends on `@atlure/types` for the `Money` value type.
