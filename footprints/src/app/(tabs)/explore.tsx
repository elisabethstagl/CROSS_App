import AppHeader from "@/components/AppHeader";
import CountryCard from "@/components/CountryCard";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useCountriesStore } from "@/store/useCountriesStore";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback } from "react";
import {
  ActivityIndicator,
  AppState,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
  const colors = useTheme();
  const db = useSQLiteContext();
  const recommendations = useCountriesStore((state) => state.recommendations);
  const loading = useCountriesStore((state) => state.loading);
  const error = useCountriesStore((state) => state.error);
  const fetchCountries = useCountriesStore((state) => state.fetchCountries);
  const discoverMore = useCountriesStore((state) => state.discoverMore);

  useFocusEffect(
    useCallback(() => {
      void fetchCountries(db);

      const subscription = AppState.addEventListener("change", (state) => {
        if (state === "active") {
          void fetchCountries(db);
        }
      });

      return () => subscription.remove();
    }, [db, fetchCountries]),
  );

  const showLoading = loading && recommendations.length === 0;

  const showError = !!error && recommendations.length === 0;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.container}>
        <View style={styles.pageHeader}>
          <AppHeader
            title="Discover"
            subtitle="Find inspiration for your next adventure."
          />
        </View>

        {error && recommendations.length > 0 && (
          <Text
            accessibilityLiveRegion="polite"
            style={[
              styles.message,
              {
                color: colors.error,
                marginBottom: Spacing.three,
              },
            ]}
          >
            Could not update recommendations. Your previous selection is still
            shown.
          </Text>
        )}

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
                  onPress={() => void discoverMore(db)}
                  disabled={loading}
                  accessibilityRole="button"
                  style={[
                    styles.button,
                    {
                      backgroundColor: colors.primary,
                    },
                  ]}
                >
                  {!loading && (
                    <MaterialIcons
                      name="refresh"
                      size={22}
                      color={colors.onPrimary}
                    />
                  )}

                  <Text style={styles.buttonText}>
                    {loading ? "Saving..." : "Discover more"}
                  </Text>
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
  pageHeader: {
    marginBottom: Spacing.four,
  },
});
