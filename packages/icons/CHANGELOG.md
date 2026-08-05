# @atlure/icons

## 0.3.0

### Minor Changes

- [#57](https://github.com/simpxlify/atlure-ui/pull/57) [`de8837d`](https://github.com/simpxlify/atlure-ui/commit/de8837ddcd3669553989aafe1018d2710449f22b) Thanks [@simpxlify](https://github.com/simpxlify)! - Add `@atlure/icons`, a single lucide import path for both surfaces. The `react-native` export condition resolves to `lucide-react-native` and everything else to `lucide-react`, so screens import `{ Heart }` without knowing which platform they are on.

  The icon set is a closed, generated list rather than a re-export of all of lucide. The native entry imports one module per icon because Metro does not tree-shake lucide's 6000-icon barrel, and registers a NativeWind `cssInterop` mapping so `className` tints a glyph through lucide's `color` prop.

### Patch Changes

- Updated dependencies [[`a8339df`](https://github.com/simpxlify/atlure-ui/commit/a8339df13489cdf634962830c51652000178f80c), [`d68ac75`](https://github.com/simpxlify/atlure-ui/commit/d68ac75461513f09ffd90931990deabee6244f32)]:
  - @atlure/tokens@0.3.0
