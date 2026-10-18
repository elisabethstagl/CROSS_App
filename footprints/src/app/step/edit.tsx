import { router, Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

import { StepForm } from "@/components/StepForm";
import { Colors } from "@/constants/theme";
import { useTripStore } from "@/store/tripStore";

export default function EditStepScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const step = useTripStore((state) =>
    state.steps.find((item) => item.id === id),
  );

  const trip = useTripStore((state) =>
    state.trips.find((item) => item.id === step?.tripId),
  );

  const updateStep = useTripStore((state) => state.updateStep);

  if (!step || !trip) {
    return (
      <View style={{ padding: 24 }}>
        <Stack.Screen options={{ title: "Edit step" }} />
        <Text style={{ color: Colors.light.text }}>Step not found.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Edit step" }} />

      <StepForm
        key={step.id}
        initialValues={step}
        onSubmit={(values) => {
          updateStep({
            ...step,
            ...values,
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
