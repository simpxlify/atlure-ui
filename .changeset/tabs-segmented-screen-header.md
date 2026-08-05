---
"@atlure/ui": minor
---

Add `Tabs`, `SegmentedControl` and `ScreenHeader`.

`Tabs` / `TabsList` / `TabsTrigger` / `TabsContent` are context-driven and work controlled or
uncontrolled. The active indicator animates between triggers using their measured layout, the trigger
row scrolls horizontally when it overflows, and content mounts lazily: a panel is absent from the tree
until its tab is first activated, then stays mounted and hidden so switching back does not refetch.

`SegmentedControl` is the compact two-to-four-option pill for role and filter switching, rendered as a
single bordered group.

`ScreenHeader` carries a title, optional subtitle, a `large` variant for the dashboard greeting, a
trailing slot for up to two `IconButton`s, and a back affordance announced as `Go back` that appears
only when `onBack` is given. Its top safe-area inset arrives as the `topInset` prop, which keeps
`react-native-safe-area-context` an optional peer dependency rather than a hard requirement.
