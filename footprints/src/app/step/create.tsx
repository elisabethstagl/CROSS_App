import { router, Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

import { StepForm } from "@/components/StepForm";
import { Colors } from "@/constants/theme";
import { useTripStore } from "@/store/tripStore";

export default function CreateStepScreen() {
  const { tripId } = useLocalSearchParams<{ tripId?: string }>();

  const trip = useTripStore((state) =>
    state.trips.find((item) => item.id === tripId),
  );

  const addStep = useTripStore((state) => state.addStep);

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
        onSubmit={(values) => {
          addStep({
            ...values,
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            tripId: trip.id,
          });

          router.dismissTo({
            pathname: "/trip/[id]",
            params: { id: trip.id },
          });
        }}
      />
    </>
  );
}
