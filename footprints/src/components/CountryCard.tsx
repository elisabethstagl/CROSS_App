import { useState } from "react";
import { Alert, View, Text, Pressable, StyleSheet } from "react-native";

import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { useSQLiteContext } from "expo-sqlite";

import type { Country } from "@/services/countriesService";
import { useCountriesStore } from "@/store/useCountriesStore";
import { useTheme } from "@/hooks/use-theme";
import { BorderRadius, Spacing } from "@/constants/theme";

interface CountryCardProps {
  country: Country;
}

export default function CountryCard({ country }: CountryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);

  const colors = useTheme();
  const db = useSQLiteContext();

  const isFavourite = useCountriesStore((state) =>
    state.favourites.some((item) => item.code === country.code),
  );

  const toggleFavourite = useCountriesStore((state) => state.toggleFavourite);

  async function handleToggleFavourite() {
    if (saving) return;

    setSaving(true);

    try {
      await toggleFavourite(db, country);
    } catch {
      Alert.alert("Could not save favourite", "Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.outline,
        },
      ]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => setExpanded(!expanded)}
          accessibilityRole="button"
          accessibilityLabel={`Show details for ${country.name}`}
          accessibilityState={{ expanded }}
          style={styles.countryHeader}
        >
          <Text style={styles.flag}>{country.flag}</Text>

          <View style={styles.titleContainer}>
            <Text style={[styles.name, { color: colors.text }]}>
              {country.name}
            </Text>

            <Text style={[styles.region, { color: colors.textSecondary }]}>
              {country.region}
            </Text>
          </View>

          <MaterialIcons
            name={expanded ? "expand-less" : "expand-more"}
            size={26}
            color={colors.primary}
          />
        </Pressable>

        <Pressable
          onPress={handleToggleFavourite}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel={
            isFavourite
              ? `Remove ${country.name} from favourites`
              : `Add ${country.name} to favourites`
          }
          accessibilityState={{ disabled: saving }}
          hitSlop={10}
          style={styles.heartButton}
        >
          <MaterialIcons
            name={isFavourite ? "favorite" : "favorite-border"}
            size={26}
            color={isFavourite ? colors.error : colors.textSecondary}
          />
        </Pressable>
      </View>

      {expanded && (
        <View style={[styles.details, { borderTopColor: colors.outline }]}>
          <DetailRow label="Capital" value={country.capital} />

          <DetailRow label="Region" value={country.region} />

          <DetailRow label="Subregion" value={country.subregion} />

          <DetailRow
            label="Population"
            value={
              country.population
                ? country.population.toLocaleString("en-US")
                : "Not available"
            }
          />

          <DetailRow
            label="Languages"
            value={
              country.languages.length > 0
                ? country.languages.join(", ")
                : "Not available"
            }
          />

          <DetailRow label="Currency" value={country.currency} />

          {country.description ? (
            <View
              style={[
                styles.descriptionContainer,
                {
                  backgroundColor: colors.surfaceVariant,
                },
              ]}
            >
              <Text
                style={[styles.descriptionTitle, { color: colors.primary }]}
              >
                About this country
              </Text>

              <Text style={[styles.description, { color: colors.text }]}>
                {country.description}
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const colors = useTheme();

  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>

      <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  countryHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  flag: {
    fontSize: 32,
    marginRight: Spacing.three,
  },

  titleContainer: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: "600",
  },

  region: {
    fontSize: 13,
    marginTop: Spacing.one,
  },

  heartButton: {
    padding: Spacing.two,
    marginLeft: Spacing.one,
  },

  details: {
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
  },

  detailRow: {
    marginBottom: Spacing.three,
  },

  detailLabel: {
    fontSize: 12,
    marginBottom: Spacing.one,
  },

  detailValue: {
    fontSize: 15,
    fontWeight: "500",
  },

  descriptionContainer: {
    marginTop: Spacing.two,
    padding: Spacing.three,
    borderRadius: BorderRadius.medium,
  },

  descriptionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: Spacing.two,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
  },
});
