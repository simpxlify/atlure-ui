# @atlure/ui

React Native components for `atlure-paw`, styled with NativeWind against `@atlure/tokens`.

## This package ships TypeScript source, not compiled output

`exports` points straight at `./src/index.ts` and `files` includes `src`. That is deliberate and it is
the one thing not to "fix".

NativeWind's `className` is a **Babel-time JSX transform** (`jsxImportSource: "nativewind"`). If this
package were precompiled — by `react-native-builder-bob`, `tsup` or plain `tsc` — the JSX would be
frozen against `react/jsx-runtime`, `className` would become a prop nobody reads, and every component
would render unstyled with no error to explain why. The consuming app's Babel pipeline has to see the
original JSX.

## Consumer setup

Two steps, both required.

**1. Add this package's source to your Tailwind `content` array.** Classes live in files inside
`node_modules`, so Tailwind will not find them otherwise and every utility used only by this package
will be missing from the compiled output:

```js
module.exports = {
  presets: [require("nativewind/preset"), require("@atlure/tailwind-preset")],
  content: ["./app/**/*.{ts,tsx}", "./node_modules/@atlure/ui/src/**/*.{ts,tsx}"],
};
```

The NativeWind preset must come first.

**2. Let Metro transpile this package.** Because it ships source, `node_modules/@atlure/ui` must not
be excluded from the Babel transform. In a default Expo project it already is not.

## Usage

```tsx
import { Avatar, Button, Card, CardContent, Text } from "@atlure/ui";

export function SitterCard({ sitter, onOpen, openLabel }) {
  return (
    <Card onPress={onOpen} accessibilityLabel={openLabel}>
      <CardContent className="flex-row items-center gap-md">
        <Avatar name={sitter.displayName} uri={sitter.avatarUrl} />
        <Text variant="title">{sitter.displayName}</Text>
      </CardContent>
    </Card>
  );
}
```

Components: `Text`, `Button`, `Card` (`CardHeader`, `CardContent`, `CardFooter`), `Input`, `Label`,
`Badge`, `Avatar`, `Separator`, `Skeleton`, `Switch`, `Checkbox`.

Every user-facing string is a prop. This package contains no display copy, so i18n stays in the app.

## Variant recipes are shared, render layers are not

The `cva` recipes live in `src/variants/` as standalone files with no React Native imports, and are
also exported from `@atlure/ui/variants`:

```ts
import { buttonVariants, buttonLabelVariants } from "@atlure/ui/variants";
```

`@atlure/ui-web` imports the same recipes and applies them to DOM elements, so a variant's spacing and
colour are defined once for both platforms and only the rendering differs. Consequently the class
strings are restricted to the **React Native-safe Tailwind subset**:

| Not allowed | Use instead |
|---|---|
| `space-x-*`, `space-y-*` | `gap-*` |
| `divide-*` | an explicit `Separator` |
| `grid`, `grid-cols-*` | `flex-row` / `flex-col` |
| descendant or sibling selectors | a class on the child |
| implicit row direction | `flex-row`, always — React Native defaults to column |

Values come from the token scales (`h-control-md`, `text-base`, `bg-primary`, `border-border/20`).
There is no raw hex anywhere in this package; to change a colour, edit `packages/tokens/src/tokens.ts`.

## The barrel is generated

`src/index.ts` is emitted by `scripts/generate-barrel.mjs` from a directory walk of `src`, and is
committed. Run `pnpm build` after adding a component — hand-editing it is pointless, since the next
build overwrites it, and CI's `git diff --exit-code` fails if it is stale.

This exists because a hand-maintained barrel is a guaranteed merge conflict whenever two branches add
a component. Modules under a `hooks/` directory and any `utils.ts` are treated as internal and left
out of the public surface.

## Accessibility

Every interactive component sets `accessibilityRole`, `accessibilityLabel` and `accessibilityState`,
**and** the matching `aria-*` alias. Both are needed: `react-native-web`, which Expo uses for the web
build, ignores `accessibilityState` in favour of `aria-*`, so state such as "checked" would silently
never be announced there.

Touch targets are guaranteed to reach 44px via `hitSlop`, computed from the `controlHeight` token
rather than hard-coded — `touchTargetHitSlop` pads a 36px or 40px control out to the minimum without
changing how it looks.

## Tests

`pnpm test` runs Vitest with React Testing Library. `react-native` is aliased to `react-native-web`
so components render into jsdom and can be queried by role and accessible name.

What that proves: press handling, disabled and loading behaviour, controlled toggle state, change
propagation, accessible roles and names, and the barrel generator's output.

What it does **not** prove: that NativeWind resolves any of these class strings. That requires a device
or simulator — a green test run here says nothing about styling.
