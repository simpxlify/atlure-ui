# Atlure brand — SVG sources

**DRAFT** LLM-designed brand assets. Will be replaced by a real designer before store submission. Owned by ticket atlure-ui#54.

Colours are locked to `packages/tokens`: primary `#ea580c`, cream `#fff7ed`, navy `#1e3a8a`.

## Files

- `mark.svg` — standalone mark, 512x512, rounded orange square with cream lowercase `a`. Source for iOS icon, favicons, PWA icons.
- `mark-foreground.svg` — Android adaptive foreground layer, 432x432, cream letter only, sized inside the 66% safe zone.
- `mark-background.svg` — Android adaptive background layer, 432x432, flat orange.
- `mark-monochrome.svg` — Android notification icon, 432x432, white silhouette on transparent.
- `wordmark-light.svg` / `wordmark-dark.svg` — `atlure` wordmark in navy (light bg) and cream (dark bg).
- `lockup-light.svg` / `lockup-dark.svg` — mark + wordmark horizontal lockup.
- `og-template.svg` — 1200x630 Open Graph template; `atlure-web`'s `og-image` route composes headlines against it.
- `splash.svg` — 1242x2688 iOS-sized splash canvas; cream background, centred mark.

## Regenerating PNGs

Rasterization is scripted per consumer repo (`atlure-paw/assets/`, `atlure-web/public/`). Reference implementations live in each repo's brand PR.
