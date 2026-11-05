import { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CountryCard from "../components/CountryCard";
import { useCountriesStore } from "../store/useCountriesStore";
import { useTheme } from "../hooks/use-theme";
import { Spacing, BottomTabInset, FontSize } from "../constants/theme";

export default function ExploreScreen() {
  const colors = useTheme();

  const countries = useCountriesStore((state) => state.countries);

  const loading = useCountriesStore((state) => state.loading);

  const error = useCountriesStore((state) => state.error);

  const fetchCountries = useCountriesStore((state) => state.fetchCountries);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Discover</Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Explore destinations for your next adventure.
        </Text>

        {loading && countries.length === 0 ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.message, { color: colors.textSecondary }]}>
              Loading countries...
            </Text>
          </View>
        ) : error && countries.length === 0 ? (
          <View style={styles.center}>
            <Text style={[styles.message, { color: colors.error }]}>
              {error}
            </Text>

            <Pressable
              onPress={fetchCountries}
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
            >
              <Text style={{ color: colors.onPrimary }}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={countries}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => <CountryCard country={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              error ? (
                <Text style={[styles.message, { color: colors.error }]}>
                  {error}
                </Text>
              ) : undefined
            }
          />
        )}
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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.three,
  },

  message: {
    fontSize: 14,
    textAlign: "center",
  },

  retryButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: 12,
  },
});
