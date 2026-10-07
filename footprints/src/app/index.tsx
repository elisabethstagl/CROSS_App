import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTripStore } from "@/store/tripStore";

export default function HomeScreen() {
  const trips = useTripStore((state) => state.trips);

  const handleAddTrip = () => {
    console.log("Add trip pressed");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Trips</Text>

          <Pressable style={styles.addButton} onPress={handleAddTrip}>
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </View>

        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.tripCard}>
              <Text style={styles.tripName}>{item.name}</Text>

              <Text style={styles.tripDate}>
                {item.startDate} – {item.endDate}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
  },

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    color: "white",
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "300",
  },

  list: {
    gap: 14,
    paddingBottom: 20,
  },

  tripCard: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  tripName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
  },

  tripDate: {
    fontSize: 14,
    color: "#666",
  },
});
