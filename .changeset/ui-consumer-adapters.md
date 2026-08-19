---
"@atlure/ui": minor
---

feat(ui): additive consumer adapters on StarRating, ErrorState, UrgencyBadge, Sheet, SearchBar.

Backwards-compatible optional props so consumers can drop inline shims without pushing app-copy or app-behavior into every call site. Every addition is strictly additive: `StarRating` gains `count?` and widens `value` to `number | null`; `ErrorState` makes `title`/`message`/`retryLabel` optional with defaults and adds `retryTestID?`; `UrgencyBadge` makes `label` optional and exports `DEFAULT_URGENCY_LABELS`; `Sheet` gains a `variant?: 'snap' | 'modal-slide'` prop and defaults `backdropAccessibilityLabel`; `SearchBar` gains an uncontrolled mode via `defaultValue` + `onCommit`. No existing 0.6.1 consumer needs a code change.
