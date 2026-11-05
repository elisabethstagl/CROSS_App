
import { ReactNode } from "react";
import { Pressable, StyleSheet } from "react-native";

import {
  BorderRadius,
  Spacing,
} from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
};

export function Card({ children, onPress }: CardProps) {
  const colors = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
        },
        pressed && onPress && styles.pressed,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: BorderRadius.large,

    elevation: 2,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  pressed: {
    opacity: 0.8,
  },
});
