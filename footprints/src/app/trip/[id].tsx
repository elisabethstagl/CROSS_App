import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useTripStore } from "@/store/tripStore";
import { formatDisplayDate } from "@/utils/date";

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const trip = useTripStore((state) =>
    state.trips.find((item) => item.id === id),
  );

  if (!trip) {
    return (
      <View style={styles.content}>
        <Stack.Screen options={{ title: "Trip details" }} />
        <Text style={styles.text}>Trip not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["left", "right", "bottom"]}>
      <Stack.Screen options={{ title: trip.name }} />

      <View style={styles.content}>
        <Text style={styles.title}>{trip.name}</Text>

        <Text style={styles.text}>
          Start: {formatDisplayDate(trip.startDate)}
        </Text>

        <Text style={styles.text}>End: {formatDisplayDate(trip.endDate)}</Text>
      </View>
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
  text: {
    fontSize: 16,
    color: Colors.light.text,
  },
});
