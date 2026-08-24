export const palette = {
  orange50: "#fff7ed",
  orange100: "#fef3e2",
  orange200: "#fed7aa",
  orange300: "#fdba74",
  orange600: "#ea580c",
  navy700: "#1e40af",
  navy800: "#1e3a8a",
  blue400: "#60a5fa",
  blue500: "#3b82f6",
  slate50: "#f1f5f9",
  slate400: "#94a3b8",
  slate600: "#475569",
  slate700: "#334155",
  slate800: "#1e293b",
  slate900: "#0f172a",
  red500: "#ef4444",
  red600: "#dc2626",
  green500: "#22c55e",
  green600: "#16a34a",
  green950: "#052e16",
  yellow400: "#facc15",
  amber500: "#f59e0b",
  amber950: "#412006",
  white: "#ffffff",
} as const;

export type SemanticToken =
  | "background"
  | "foreground"
  | "card"
  | "cardForeground"
  | "popover"
  | "popoverForeground"
  | "primary"
  | "primaryForeground"
  | "secondary"
  | "secondaryForeground"
  | "muted"
  | "mutedForeground"
  | "accent"
  | "accentForeground"
  | "destructive"
  | "destructiveForeground"
  | "success"
  | "successForeground"
  | "warning"
  | "warningForeground"
  | "border"
  | "input"
  | "inputBackground"
  | "ring"
  | "chart1"
  | "chart2"
  | "chart3"
  | "chart4"
  | "chart5";

export type SemanticScale = Record<SemanticToken, string>;

export const semantic: { light: SemanticScale; dark: SemanticScale } = {
  light: {
    background: palette.orange50,
    foreground: palette.navy800,
    card: palette.white,
    cardForeground: palette.navy800,
    popover: palette.white,
    popoverForeground: palette.navy800,
    primary: palette.orange600,
    primaryForeground: palette.white,
    secondary: palette.orange200,
    secondaryForeground: palette.navy800,
    muted: palette.orange100,
    mutedForeground: palette.navy700,
    accent: palette.orange300,
    accentForeground: palette.navy800,
    destructive: palette.red600,
    destructiveForeground: palette.white,
    success: palette.green600,
    successForeground: palette.white,
    warning: palette.amber500,
    warningForeground: palette.amber950,
    border: palette.orange600,
    input: palette.orange600,
    inputBackground: palette.white,
    ring: palette.orange600,
    chart1: palette.orange600,
    chart2: palette.navy800,
    chart3: palette.orange300,
    chart4: palette.navy700,
    chart5: palette.orange200,
  },
  dark: {
    background: palette.slate900,
    foreground: palette.slate50,
    card: palette.slate800,
    cardForeground: palette.slate50,
    popover: palette.slate800,
    popoverForeground: palette.slate50,
    primary: palette.orange600,
    primaryForeground: palette.white,
    secondary: palette.slate700,
    secondaryForeground: palette.slate50,
    muted: palette.slate700,
    mutedForeground: palette.slate400,
    accent: palette.slate600,
    accentForeground: palette.slate50,
    destructive: palette.red500,
    destructiveForeground: palette.slate50,
    success: palette.green500,
    successForeground: palette.green950,
    warning: palette.yellow400,
    warningForeground: palette.amber950,
    border: palette.slate700,
    input: palette.slate700,
    inputBackground: palette.slate800,
    ring: palette.orange600,
    chart1: palette.orange600,
    chart2: palette.blue500,
    chart3: palette.orange300,
    chart4: palette.blue400,
    chart5: palette.orange200,
  },
};

export const radius = {
  sm: 4,
  md: 6,
  lg: 10,
  xl: 14,
  full: 9999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
} as const;

export const lineHeight = {
  xs: 16,
  sm: 20,
  base: 24,
  lg: 28,
  xl: 28,
  "2xl": 32,
  "3xl": 36,
} as const;

export const controlHeight = {
  sm: 36,
  md: 40,
  lg: 48,
  icon: 40,
} as const;

const textareaVerticalPadding = spacing.sm * 2;

export const textareaHeight = {
  2: lineHeight.base * 2 + textareaVerticalPadding,
  3: lineHeight.base * 3 + textareaVerticalPadding,
  4: lineHeight.base * 4 + textareaVerticalPadding,
  6: lineHeight.base * 6 + textareaVerticalPadding,
} as const;

export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;
