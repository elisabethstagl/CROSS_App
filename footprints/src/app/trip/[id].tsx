
import { StepCard } from "@/components/StepCard";
import { BorderRadius, IconSize } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useTripStore } from "@/store/tripStore";
import { formatDisplayDate } from "@/utils/date";

import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import {
  router,
  Stack,
  useLocalSearchParams,
} from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function TripDetailsScreen() {
  const colors = useTheme();

  const { id } = useLocalSearchParams<{ id: string }>();

  const db = useSQLiteContext();

  const trip = useTripStore((state) =>
    state.trips.find((item) => item.id === id)
  );

  const allSteps = useTripStore((state) => state.steps);

  const steps = allSteps.filter(
    (step) => step.tripId === id
  );

  const removeStep = useTripStore(
    (state) => state.removeStep
  );

  function handleDeleteStep(stepId: string) {
    Alert.alert(
      "Delete step",
      "Are you sure you want to delete this step?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await removeStep(stepId, db);
            } catch {
              Alert.alert(
                "Delete failed",
                "Could not delete the step. Please try again."
              );
            }
          },
        },
      ]
    );
  }

  if (!trip) {
    return (
      <View
        style={[
          styles.screen,
          { backgroundColor: colors.background },
        ]}
      >
        <Stack.Screen
          options={{ title: "Trip details" }}
        />

        <View style={styles.content}>
          <Text
            style={[
              styles.text,
              { color: colors.text },
            ]}
          >
            Trip not found.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.screen,
        { backgroundColor: colors.background },
      ]}
      edges={["left", "right", "bottom"]}
    >
      <Stack.Screen
        options={{
          title: trip.name,
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
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                flex: 1,
              },
            ]}
          >
            {trip.name}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Create step"
            style={({ pressed }) => [
              styles.addButton,
              {
                backgroundColor: colors.primary,
              },
              pressed && styles.addButtonPressed,
            ]}
            onPress={() => {
              router.push({
                pathname: "/step/create",
                params: { tripId: trip.id },
              });
            }}
          >
            <MaterialIcons
              name="add"
              size={IconSize.large}
              color={colors.onPrimary}
            />
          </Pressable>
        </View>

        <Text
          style={[
            styles.text,
            { color: colors.textSecondary },
          ]}
        >
          {formatDisplayDate(trip.startDate)}
          {" – "}
          {formatDisplayDate(trip.endDate)}
        </Text>

        {steps.map((step) => (
          <StepCard
            key={step.id}
            step={step}
            onPress={() => {
              router.push({
                pathname: "/step/[id]",
                params: { id: step.id },
              });
            }}
            onEdit={() => {
              router.push({
                pathname: "/step/edit",
                params: { id: step.id },
              });
            }}
            onDelete={() =>
              handleDeleteStep(step.id)
            }
          />
        ))}
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
  },

  text: {
    fontSize: 16,
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
});
