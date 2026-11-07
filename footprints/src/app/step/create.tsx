import { StepForm } from "@/components/StepForm";
import { Colors } from "@/constants/theme";
import { confirmTripDates } from "@/services/confirmTripDates";
import { useTripStore } from "@/store/tripStore";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Text, View } from "react-native";

export default function CreateStepScreen() {
  const { tripId } = useLocalSearchParams<{ tripId?: string }>();

  const trip = useTripStore((state) =>
    state.trips.find((item) => item.id === tripId),
  );

  const addStep = useTripStore((state) => state.addStep);

  const db = useSQLiteContext();

  if (!trip) {
    return (
      <View style={{ padding: 24 }}>
        <Stack.Screen options={{ title: "Create step" }} />
        <Text style={{ color: Colors.light.text }}>Trip not found.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Create step" }} />

      <StepForm
        key={trip.id}
        onSubmit={async (values) => {
          const accepted = await confirmTripDates(trip, values.date);

          if (!accepted) {
            return false;
          }

          await addStep(
            {
              ...values,
              id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              tripId: trip.id,
            },
            db,
          );

          router.dismissTo({
            pathname: "/trip/[id]",
            params: { id: trip.id },
          });
        }}
      />
    </>
  );
}
