import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TripCard } from "@/components/TripCard";
import {
  BorderRadius,
  IconSize,
  Spacing,
  BottomTabInset,
  FontSize,
} from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useTripStore } from "@/store/tripStore";

export default function HomeScreen() {
  const colors = useTheme();

  const trips = useTripStore((state) => state.trips);
  const removeTrip = useTripStore((state) => state.removeTrip);

  const handleAddTrip = () => {
    console.log("Add trip pressed");
  };

  const handleDeleteTrip = (id: string, name: string) => {
    Alert.alert("Delete Trip", `Are you sure you want to delete "${name}"?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => removeTrip(id),
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>My Trips</Text>

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: colors.primary },
              pressed && styles.addButtonPressed,
            ]}
            onPress={handleAddTrip}
          >
            <MaterialIcons
              name="add"
              size={IconSize.large}
              color={colors.onPrimary}
            />
          </Pressable>
        </View>

        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TripCard
              trip={item}
              onPress={() => {
                console.log("Open trip:", item.id);
              }}
              onEdit={() => {
                console.log("Edit trip:", item.id);
              }}
              onDelete={() => {
                handleDeleteTrip(item.id, item.name);
              }}
            />
          )}
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.four,
  },

  title: {
    fontSize: FontSize.screenTitle,
    fontWeight: "700",
    marginBottom: Spacing.two,
  },

  addButton: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.large,
    alignItems: "center",
    justifyContent: "center",

    elevation: 4,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  addButtonPressed: {
    opacity: 0.8,
  },

  list: {
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
  },
});
