import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#242824",
    textSecondary: "#68736C",

    background: "#FAF8F3",
    surface: "#FFFFFF",
    surfaceVariant: "#F1F3EF",

    primary: "#3F6654",
    onPrimary: "#FFFFFF",
    primaryContainer: "#D9E6DE",
    onPrimaryContainer: "#173729",

    accent: "#C96F4A",
    onAccent: "#FFFFFF",

    outline: "#D9DDD8",

    error: "#B94A48",
    onError: "#FFFFFF",
  },

  dark: {
    text: "#E8EDE9",
    textSecondary: "#B6C0B9",

    background: "#151A17",
    surface: "#202722",
    surfaceVariant: "#292F2B",

    primary: "#A7CDB8",
    onPrimary: "#173729",
    primaryContainer: "#294B3B",
    onPrimaryContainer: "#D9E6DE",

    accent: "#E29A7C",
    onAccent: "#442A20",

    outline: "#89938C",

    error: "#FFB4AB",
    onError: "#690005",
  },
} as const;

export type ThemeColor =
  keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },

  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },

  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BorderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  extraLarge: 28,
  full: 999,
} as const;

export const IconSize = {
  small: 18,
  medium: 22,
  large: 28,
} as const;

export const BottomTabInset =
  Platform.select({
    ios: 50,
    android: 80,
  }) ?? 0;

export const MaxContentWidth = 800;