---
"@atlure/ui": minor
---

Give `Text` the typography scale the design system actually specifies, and a `TextClassContext` so container components can set descendant text colour.

**Breaking:** the `variant` axis is now `display | h1 | h2 | h3 | body | bodySm | label | caption`, replacing `heading | title | subtitle | overline`. `tone` gains `inverse`, mapping to the `primary-foreground` token.

React Native has no text style inheritance and no descendant selectors, so `Button` and `Card` cannot colour their labels by styling a parent. `TextClassProvider` gives them a way to do it once. Precedence is deliberate: an inherited class beats the default `tone`, and an explicit `className` on the `Text` beats both.
