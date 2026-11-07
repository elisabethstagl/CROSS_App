import { TripCard } from "@/components/TripCard";
import {
  BottomTabInset,
  BorderRadius,
  FontSize,
  IconSize,
  Spacing,
} from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useTripStore } from "@/store/tripStore";

import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import AppHeader from "@/components/AppHeader";

import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const colors = useTheme();
  const db = useSQLiteContext();

  const trips = useTripStore((state) => state.trips);

  const removeTrip = useTripStore((state) => state.removeTrip);

  const handleAddTrip = () => {
    router.push("/trip/create");
  };

  const handleDeleteTrip = (id: string, name: string) => {
    Alert.alert("Delete trip", `Are you sure you want to delete "${name}"?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await removeTrip(id, db);
          } catch {
            Alert.alert(
              "Delete failed",
              "Could not delete the trip. Please try again.",
            );
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
        },
      ]}
      edges={["top"]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <AppHeader title="My Trips" />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: colors.primary },
              pressed && styles.addButtonPressed,
            ]}
            onPress={handleAddTrip}
            accessibilityRole="button"
            accessibilityLabel="Create trip"
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
          contentContainerStyle={[
            styles.list,
            trips.length === 0 && styles.emptyList,
          ]}
          renderItem={({ item }) => (
            <TripCard
              trip={item}
              onPress={() => {
                router.push({
                  pathname: "/trip/[id]",
                  params: {
                    id: item.id,
                  },
                });
              }}
              onEdit={() => {
                router.push({
                  pathname: "/trip/edit",
                  params: {
                    id: item.id,
                  },
                });
              }}
              onDelete={() => {
                handleDeleteTrip(item.id, item.name);
              }}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons
                name="luggage"
                size={52}
                color={colors.textSecondary}
              />

              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No trips yet
              </Text>

              <Text
                style={[
                  styles.emptyDescription,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Create your first trip and start collecting memories.
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },

  headerTitle: {
    flex: 1,
    minWidth: 0,
  },

  addButton: {
    width: 48,
    height: 48,
    flexShrink: 0,
    borderRadius: BorderRadius.large,
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonPressed: {
    opacity: 0.8,
  },

  list: {
    gap: Spacing.three,
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
  },

  emptyDescription: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
});
