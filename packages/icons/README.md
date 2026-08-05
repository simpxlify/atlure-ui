# @atlure/icons

One icon import path for both Atlure surfaces. Screens write `import { Heart } from "@atlure/icons"` and the export conditions decide whether that resolves to `lucide-react-native` or `lucide-react`.

```tsx
import { Heart, MapPin, iconSize } from "@atlure/icons";

<Heart size={iconSize.md} className="text-primary" />;
```

## Why a wrapper exists

Native needs `lucide-react-native`, the DOM needs `lucide-react`, and no screen should have to know which surface it is on. `@expo/vector-icons` was rejected because its glyph set does not match the product spec.

## Peers

`react` is always required. The native entry additionally needs `react-native` and **`react-native-svg`**, which the consuming app must install itself, and `nativewind` for `className` support. All three are optional peers so a web-only consumer installs nothing extra.

## The icon set is a closed list

`scripts/icon-names.mjs` is the source of truth: the icon names the product spec actually uses. `src/icon-names.ts`, `src/web.ts` and `src/native.ts` are generated from it by `pnpm build` and must never be hand-edited.

Add an icon by adding its name to `scripts/icon-names.mjs` and rebuilding. If the installed lucide version no longer exports that name, generation fails with the name in the error rather than emitting a broken entry.

Two names from the prototype are deliberately absent: **`Chrome`** and **`Facebook`**. lucide removed its brand glyphs in v1, so the social sign-in buttons need a different source — that is a brand-asset decision, not an icon-package one.

## Native imports one module per icon, the DOM imports the barrel

The native entry imports each icon from its own `lucide-react-native/icons/*` module because Metro does not tree-shake the 6000-icon barrel, and pulling it in would ship every glyph in the app bundle. Bundlers on the web side do tree-shake, so the DOM entry re-exports from the barrel.

The name-to-module mapping is read out of lucide's own barrel at generation time rather than derived from the name, because it is not mechanical: `AlertCircle` lives in `circle-alert`, `Edit3` in `pen-line`, `CheckCircle` in `circle-check-big`.

## `className` on native goes through cssInterop

`lucide-react-native` colours its glyphs from a `color` prop, not from a style. `src/register-icon-interop.ts` registers a NativeWind `cssInterop` mapping that moves the resolved `color` off the style and onto that prop, so `className="text-primary"` tints an icon. The native entry imports it before it re-exports anything.

As with every NativeWind class, this is only truly proven once an icon has been seen tinted on a device — a green test suite cannot prove a Babel-time transform applied.

## Sizes

`iconSize` derives `sm`/`md`/`lg` (16/20/24) from `@atlure/tokens` spacing. lucide's own default of 24 equals `iconSize.lg`, and a test locks that equivalence, so an unstyled icon already renders at the token size without a wrapper component.
