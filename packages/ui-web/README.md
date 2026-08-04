# @atlure/ui-web

DOM components for **atlure-web**, the Atlure marketing and SEO surface.

This package is deliberately small. Atlure's product is the Expo app, so product UI belongs in
[`@atlure/ui`](../ui) — not here. What lives here is the handful of components a marketing site
actually needs: `Button`, `Card`, `Badge`, `Input`, `Accordion`, and the `Container` / `Stack`
layout primitives. If you are reaching for a booking flow, a message thread or a sitter card, you
are in the wrong package.

There is no `react-native` dependency, direct or transitive.

## Install

```bash
pnpm add @atlure/ui-web @atlure/tailwind-preset
```

Wire the preset and the token CSS variables into the consuming app:

```js
const preset = require('@atlure/tailwind-preset');

module.exports = {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx}', './node_modules/@atlure/ui-web/dist/**/*.js'],
};
```

```css
@import '@atlure/tokens/theme.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Dark mode is class-based: put `dark` on `<html>`.

## Usage

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from '@atlure/ui-web';

export function SitterTeaser({ name, onBook }: { name: string; onBook: () => void }) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={onBook}>Book</Button>
      </CardContent>
    </Card>
  );
}
```

Every user-facing string is a prop. This package hardcodes no display text, so the consuming app
owns i18n.

## Variant recipes are shared, not duplicated

The `class-variance-authority` recipes are the shared artifact between web and native — NativeWind
accepts the same Tailwind class strings on React Native components, so only the render layer
(~15 lines per component) differs per platform.

```
src/variants/
  shared.ts      the cross-platform recipes: button, badge, card, input, accordion
  layout.ts      web-only recipes: container, stack
  index.ts       public barrel, re-exported at @atlure/ui-web/variants
```

`shared.ts` is the swap point. `@atlure/ui` is not published yet; the moment it exposes its recipe
subpath, `shared.ts` becomes a single line:

```ts
export * from '@atlure/ui/variants';
```

and the five recipe files here are deleted. Nothing else in the package changes. Until then, keep
the recipes inside `src/variants/` restricted to the React Native-safe Tailwind subset — no
`space-x-*`, no `divide-*`, no `grid`, no descendant selectors, and `flex-row` stated explicitly.
Web-only escapes (`mx-auto`, `max-w-screen-*`, arbitrary variants) belong in `layout.ts` or in the
render layer.

Never redefine a token here. Colors, spacing, radii, type scale and control heights all come from
`@atlure/tokens` by way of `@atlure/tailwind-preset`.

## Components are reviewed in Storybook

Stories live in [`apps/storybook-web`](../../apps/storybook-web), never in this package — a
workbench that cannot be reached from a published package cannot leak into one.

```bash
pnpm --filter storybook-web storybook
```

## Scripts

| Script | What it does |
| --- | --- |
| `build` | `tsup` → ESM, CJS and `.d.ts` in `dist/` |
| `typecheck` | `tsc --noEmit` |
| `test` | Vitest + React Testing Library |

## License

MIT © David Moreira
