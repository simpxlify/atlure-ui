# atlure-ui

The Atlure design system. A pnpm workspace publishing the `@atlure/*` packages consumed by
[atlure-paw](https://github.com/simpxlify/atlure-paw) (Expo, the product) and
[atlure-web](https://github.com/simpxlify/atlure-web) (Next.js, marketing and SEO).

| Package | Purpose |
|---|---|
| `@atlure/tokens` | Single source of truth for color, radius, spacing and type scales. Generates every downstream artifact. |
| `@atlure/tailwind-preset` | Generated Tailwind preset, shared by web Tailwind and mobile NativeWind. |
| `@atlure/types` | Domain model. Zero dependencies. |
| `@atlure/ui` | React Native components, shipped as source so NativeWind can transform them. |
| `@atlure/ui-web` | The small DOM component set the marketing site needs. |

## Setup

```
corepack enable pnpm
pnpm install
pnpm -r build
pnpm -r test
```

`pnpm` is not installed globally on the primary dev machine and must come from corepack.

## Read before contributing

`AGENTS.md` holds the standing rules. The two that bite hardest: never hand-edit generated
files, and do not upgrade Tailwind past 3.4 or NativeWind past 4.2 — a single shared preset
across web and React Native depends on that pairing.
