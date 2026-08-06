---
"@atlure/ui": minor
---

feat(ui): Calendar, DateRangePicker and TimePicker (ticket 040).

Native components composing `@atlure/ui`'s Sheet for the TimePicker and using `Intl` (no `moment`, no `date-fns`) for locale-aware month grids, weekday order, and full-date accessibility labels. ISO `YYYY-MM-DD` at the boundary — no `Date` instances in props or callbacks. `DateRangePicker` enforces `minNights`/`maxNights` and rejects invalid two-tap sequences without disturbing the committed range.
