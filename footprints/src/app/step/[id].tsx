import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useTripStore } from "@/store/tripStore";
import { formatDisplayDate } from "@/utils/date";

export default function StepDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const step = useTripStore((state) =>
    state.steps.find((item) => item.id === id),
  );

  if (!step) {
    return (
      <View style={styles.content}>
        <Stack.Screen options={{ title: "Step details" }} />
        <Text style={styles.text}>Step not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["left", "right", "bottom"]}>
      <Stack.Screen options={{ title: step.name || "Step details" }} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{step.name || "Unnamed step"}</Text>

        <Text style={styles.date}>{formatDisplayDate(step.date)}</Text>

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
            <Text style={styles.sectionTitle}>Note</Text>
            <Text style={styles.text}>{step.note}</Text>
          </>
        )}

        {step.latitude != null && step.longitude != null && (
          <>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.text}>
              {step.latitude}, {step.longitude}
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
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.light.text,
  },
  date: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  sectionTitle: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.text,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.text,
  },
  photo: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 12,
  },
});
