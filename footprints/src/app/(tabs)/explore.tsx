import { useCallback, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";

import CountryCard from "@/components/CountryCard";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useCountriesStore } from "@/store/useCountriesStore";

export default function ExploreScreen() {
  const colors = useTheme();
  const db = useSQLiteContext();

  const countries = useCountriesStore((state) => state.countries);

  const recommendations = useCountriesStore((state) => state.recommendations);

  const loading = useCountriesStore((state) => state.loading);

  const error = useCountriesStore((state) => state.error);

  const fetchCountries = useCountriesStore((state) => state.fetchCountries);

  const discoverMore = useCountriesStore((state) => state.discoverMore);

  useEffect(() => {
    void fetchCountries(db);
  }, [db, fetchCountries]);

  useFocusEffect(
    useCallback(() => {
      // Only generate a new batch when there
      // are already recommendations to replace.
      // Initial recommendations are generated
      // by fetchCountries().
      if (useCountriesStore.getState().recommendations.length > 0) {
        discoverMore();
      }
    }, [discoverMore]),
  );

  const showLoading = loading && countries.length === 0;

  const showError = !!error && countries.length === 0;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Discover</Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Find inspiration for your next adventure.
        </Text>

        {showLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />

            <Text style={[styles.message, { color: colors.textSecondary }]}>
              Finding destinations...
            </Text>
          </View>
        ) : showError ? (
          <View style={styles.center}>
            <Text style={[styles.message, { color: colors.error }]}>
              {error}
            </Text>

            <Pressable
              onPress={() => void fetchCountries(db)}
              style={[
                styles.button,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <Text style={styles.buttonText}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={recommendations}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => <CountryCard country={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              <View style={styles.sectionHeader}>
                <View style={styles.sectionText}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Recommended destinations
                  </Text>

                  <Text
                    style={[
                      styles.sectionSubtitle,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    {recommendations.length} places to explore
                  </Text>
                </View>

                <MaterialIcons
                  name="explore"
                  size={28}
                  color={colors.primary}
                />
              </View>
            }
            ListFooterComponent={
              recommendations.length > 0 ? (
                <Pressable
                  onPress={discoverMore}
                  accessibilityRole="button"
                  style={[
                    styles.button,
                    {
                      backgroundColor: colors.primary,
                    },
                  ]}
                >
                  <MaterialIcons name="refresh" size={22} color="#FFFFFF" />

                  <Text style={styles.buttonText}>Discover more</Text>
                </Pressable>
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
    fontSize: 28,
    fontWeight: "700",
    marginBottom: Spacing.two,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: Spacing.four,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.four,
  },

  sectionText: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  sectionSubtitle: {
    fontSize: 13,
    marginTop: Spacing.one,
  },

  list: {
    paddingBottom: BottomTabInset + Spacing.four,
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

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: 12,
    marginTop: Spacing.three,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
