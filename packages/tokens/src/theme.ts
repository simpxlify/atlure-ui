import {
  controlHeight,
  fontSize,
  fontWeight,
  lineHeight,
  radius,
  semantic,
  spacing,
  type SemanticScale,
} from "./tokens.js";

export type ColorScheme = "light" | "dark";

export interface Theme {
  colors: SemanticScale;
  radius: typeof radius;
  spacing: typeof spacing;
  fontSize: typeof fontSize;
  lineHeight: typeof lineHeight;
  controlHeight: typeof controlHeight;
  fontWeight: typeof fontWeight;
}

function buildTheme(scheme: ColorScheme): Theme {
  return {
    colors: semantic[scheme],
    radius,
    spacing,
    fontSize,
    lineHeight,
    controlHeight,
    fontWeight,
  };
}

export const THEME: Record<ColorScheme, Theme> = {
  light: buildTheme("light"),
  dark: buildTheme("dark"),
};
