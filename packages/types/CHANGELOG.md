# @atlure/types

## 0.7.0

## 0.6.1

## 0.6.0

## 0.5.0

## 0.4.0

### Minor Changes

- [#72](https://github.com/simpxlify/atlure-ui/pull/72) [`6bebb2b`](https://github.com/simpxlify/atlure-ui/commit/6bebb2bdb253a59e518eac3157bd2a08be8582a3) Thanks [@simpxlify](https://github.com/simpxlify)! - Add shared `ErrorCode` / `Result<T>` model and `errorMessageKey` helper so `atlure-paw`, `atlure-web`, and `atlure-api` can speak the same error taxonomy.

## 0.3.0

### Patch Changes

- [#60](https://github.com/simpxlify/atlure-ui/pull/60) [`a8339df`](https://github.com/simpxlify/atlure-ui/commit/a8339df13489cdf634962830c51652000178f80c) Thanks [@simpxlify](https://github.com/simpxlify)! - Make both packages resolvable by non-ESM resolvers. Their root export declared only `types` and `import`, so anything that did not match the `import` condition failed outright with `ERR_PACKAGE_PATH_NOT_EXPORTED` — jest, postcss configs, and any `*.config.js`. Adding a `default` condition alongside `import` fixes it without changing what ESM consumers resolve to.

## 0.2.0

### Minor Changes

- [`3d44338`](https://github.com/simpxlify/atlure-ui/commit/3d443385f8ab518c7399160e1128af3ce341457e) Thanks [@simpxlify](https://github.com/simpxlify)! - Initial release of the Atlure design system.

  `@atlure/tokens` is the single source of truth for colour, radius, spacing and type scales, generating the web CSS variables, the NativeWind stylesheet, the Tailwind preset, the React Native theme object and `NAV_THEME` from one file. `@atlure/types` carries the domain model. `@atlure/ui` provides eleven React Native components, shipped as untranspiled source so NativeWind's babel transform can apply. `@atlure/ui-web` provides the DOM component set the marketing site needs, with a parity test enforcing a consistent API surface across both platforms.
