---
'@atlure/ui-web': minor
---

Add `@atlure/ui-web`: Button, Card, Badge, Input, Accordion and the Container/Stack layout
primitives for the marketing surface, built on Radix primitives.

Web and native deliberately keep separate cva recipes, because React Native has no CSS
pseudo-classes, no text style inheritance and no `inline-flex`. A parity test enforces the shared
API surface instead, so variant and size option names cannot drift between platforms.
