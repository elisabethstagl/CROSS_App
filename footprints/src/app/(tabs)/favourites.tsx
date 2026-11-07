import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";

import CountryCard from "@/components/CountryCard";
import { BottomTabInset, FontSize, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useCountriesStore } from "@/store/useCountriesStore";

export default function FavouritesScreen() {
  const colors = useTheme();

  const favourites = useCountriesStore((state) => state.favourites);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Favourites</Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Countries you want to visit.
        </Text>

        <FlatList
          data={favourites}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => <CountryCard country={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            favourites.length === 0 && styles.emptyList,
          ]}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons
                name="favorite-border"
                size={52}
                color={colors.textSecondary}
              />

              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No favourites yet
              </Text>

              <Text
                style={[styles.emptyMessage, { color: colors.textSecondary }]}
              >
                Explore countries and tap the heart to save your favourite
                destinations.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
  },

  title: {
    fontSize: FontSize.screenTitle,
    fontWeight: "700",
    marginBottom: Spacing.two,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: Spacing.four,
  },

  list: {
    paddingBottom: BottomTabInset + Spacing.three,
  },

  emptyList: {
    flexGrow: 1,
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },

  emptyMessage: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },
});
