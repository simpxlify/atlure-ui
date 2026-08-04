import { semantic } from "./tokens.js";

export interface NavigationFontStyle {
  fontFamily: string;
  fontWeight:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
}

export interface NavigationTheme {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
  fonts: {
    regular: NavigationFontStyle;
    medium: NavigationFontStyle;
    bold: NavigationFontStyle;
    heavy: NavigationFontStyle;
  };
}

const systemFontFamily = "System";

const fonts: NavigationTheme["fonts"] = {
  regular: { fontFamily: systemFontFamily, fontWeight: "400" },
  medium: { fontFamily: systemFontFamily, fontWeight: "500" },
  bold: { fontFamily: systemFontFamily, fontWeight: "700" },
  heavy: { fontFamily: systemFontFamily, fontWeight: "800" },
};

export const NAV_THEME: { light: NavigationTheme; dark: NavigationTheme } = {
  light: {
    dark: false,
    colors: {
      primary: semantic.light.primary,
      background: semantic.light.background,
      card: semantic.light.card,
      text: semantic.light.foreground,
      border: semantic.light.border,
      notification: semantic.light.destructive,
    },
    fonts,
  },
  dark: {
    dark: true,
    colors: {
      primary: semantic.dark.primary,
      background: semantic.dark.background,
      card: semantic.dark.card,
      text: semantic.dark.foreground,
      border: semantic.dark.border,
      notification: semantic.dark.destructive,
    },
    fonts,
  },
};
