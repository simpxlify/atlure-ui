# @atlure/icons

## 0.6.1

### Patch Changes

- Updated dependencies []:
  - @atlure/tokens@0.6.1

## 0.6.0

### Patch Changes

- Updated dependencies []:
  - @atlure/tokens@0.6.0

## 0.5.0

### Minor Changes

- [#82](https://github.com/simpxlify/atlure-ui/pull/82) [`9e79f78`](https://github.com/simpxlify/atlure-ui/commit/9e79f7829ba9da7efc1a9ba44a90b2f6b5e64085) Thanks [@simpxlify](https://github.com/simpxlify)! - Add the `StarHalf` icon and a `fill` prop to `IconProps`.

  A star rating needs three states — full, half and empty — and only the outline `Star` existed. lucide
  has no separate filled-star icon; the sanctioned way to fill any lucide glyph is the SVG `fill`
  attribute, so `IconProps` now carries `fill?: string` alongside `color`. `<Star fill="currentColor" />`
  renders a solid star, and `StarHalf` covers the half step.

  `fill` works on every icon in the set, not just stars, so any glyph can be rendered solid without a
  second asset.

### Patch Changes

- Updated dependencies [[`bead6ab`](https://github.com/simpxlify/atlure-ui/commit/bead6ab0c6a1563a1f62a0d89a05c35ea7f71cfa)]:
  - @atlure/tokens@0.5.0

## 0.4.0

### Patch Changes

- Updated dependencies [[`d5a9526`](https://github.com/simpxlify/atlure-ui/commit/d5a9526e0d5ebfff45f20eb525849b0f9c073350)]:
  - @atlure/tokens@0.4.0

## 0.3.0

### Minor Changes

- [#57](https://github.com/simpxlify/atlure-ui/pull/57) [`de8837d`](https://github.com/simpxlify/atlure-ui/commit/de8837ddcd3669553989aafe1018d2710449f22b) Thanks [@simpxlify](https://github.com/simpxlify)! - Add `@atlure/icons`, a single lucide import path for both surfaces. The `react-native` export condition resolves to `lucide-react-native` and everything else to `lucide-react`, so screens import `{ Heart }` without knowing which platform they are on.

  The icon set is a closed, generated list rather than a re-export of all of lucide. The native entry imports one module per icon because Metro does not tree-shake lucide's 6000-icon barrel, and registers a NativeWind `cssInterop` mapping so `className` tints a glyph through lucide's `color` prop.

### Patch Changes

- Updated dependencies [[`a8339df`](https://github.com/simpxlify/atlure-ui/commit/a8339df13489cdf634962830c51652000178f80c), [`d68ac75`](https://github.com/simpxlify/atlure-ui/commit/d68ac75461513f09ffd90931990deabee6244f32)]:
  - @atlure/tokens@0.3.0
