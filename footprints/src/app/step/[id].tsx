import { useTheme } from "@/hooks/use-theme";
import { useTripStore } from "@/store/tripStore";
import { formatDisplayDate } from "@/utils/date";
import { getPlaceName } from "@/services/nativeFeatures";

import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";

import { ScrollView, StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function StepDetailsScreen() {
  const colors = useTheme();

  const { id } = useLocalSearchParams<{ id: string }>();

  const step = useTripStore((state) =>
    state.steps.find((item) => item.id === id),
  );

  const [placeName, setPlaceName] = useState<string | null>(null);

  const latitude = step?.latitude;
  const longitude = step?.longitude;

  useEffect(() => {
    if (latitude == null || longitude == null) {
      setPlaceName(null);
      return;
    }

    let active = true;

    setPlaceName(null);

    async function loadPlaceName() {
      const place = await getPlaceName(latitude!, longitude!);

      if (active) {
        setPlaceName(place);
      }
    }

    loadPlaceName();

    return () => {
      active = false;
    };
  }, [latitude, longitude]);

  if (!step) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: "Step details" }} />

        <View style={styles.content}>
          <Text style={[styles.text, { color: colors.text }]}>
            Step not found.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
      edges={["left", "right", "bottom"]}
    >
      <Stack.Screen
        options={{
          title: step.name || "Step details",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            color: colors.text,
          },
        }}
      />

      <ScrollView
        style={{
          backgroundColor: colors.background,
        }}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          {step.name || "Unnamed step"}
        </Text>

        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {formatDisplayDate(step.date)}
        </Text>

        {step.photoUri && (
          <Image
            source={{ uri: step.photoUri }}
            style={styles.photo}
            contentFit="cover"
            accessibilityLabel={`Photo of ${step.name}`}
          />
        )}

        {step.note.trim().length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Note
            </Text>

            <Text style={[styles.text, { color: colors.text }]}>
              {step.note}
            </Text>
          </>
        )}

        {latitude != null && longitude != null && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Location
            </Text>

            <Text style={[styles.text, { color: colors.text }]}>
              {placeName ?? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`}
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    padding: 24,
    gap: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
  },

  date: {
    fontSize: 14,
  },

  sectionTitle: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "600",
  },

  text: {
    fontSize: 16,
    lineHeight: 24,
  },

  photo: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 12,
  },
});
