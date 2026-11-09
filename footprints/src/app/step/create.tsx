
import { StepForm } from "@/components/StepForm";
import { useTheme } from "@/hooks/use-theme";
import { confirmTripDates } from "@/services/confirmTripDates";
import { useTripStore } from "@/store/tripStore";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Text, View } from "react-native";

export default function CreateStepScreen() {
  const colors = useTheme();

  const { tripId } = useLocalSearchParams<{
    tripId?: string;
  }>();

  const trip = useTripStore((state) =>
    state.trips.find((item) => item.id === tripId)
  );

  const addStep = useTripStore((state) => state.addStep);
  const db = useSQLiteContext();

  if (!trip) {
    return (
      <View
        style={{
          flex: 1,
          padding: 24,
          backgroundColor: colors.background,
        }}
      >
        <Stack.Screen options={{ title: "Create step" }} />
        <Text style={{ color: colors.text }}>
          Trip not found.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Create step" }} />

      <StepForm
        key={trip.id}
        onSubmit={async (values) => {
          const accepted = await confirmTripDates(
            trip,
            values.date
          );

          if (!accepted) {
            return false;
          }

          await addStep(
            {
              ...values,
              id: `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}`,
              tripId: trip.id,
            },
            db
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
