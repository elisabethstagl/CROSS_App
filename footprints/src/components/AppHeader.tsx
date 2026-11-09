import { StyleSheet, Text, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import FootprintsLogo from "./FootprintsLogo";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function AppHeader({ title, subtitle }: AppHeaderProps) {
  const colors = useTheme();

  return (
    <View style={styles.container}>
      <FootprintsLogo size={28} />

      <View style={styles.textContainer}>
        <Text style={[styles.brand, { color: colors.primary }]}>
          FOOTPRINTS
        </Text>

        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },

  textContainer: {
    flex: 1,
  },

  brand: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  title: {
    fontSize: 21,
    fontWeight: "700",
    marginTop: 1,
  },

  subtitle: {
    fontSize: 12,
    marginTop: Spacing.one,
  },
});
