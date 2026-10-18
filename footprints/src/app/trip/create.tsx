import { router, Stack } from "expo-router";

import { TripForm } from "@/components/TripForm";
import { useTripStore } from "@/store/tripStore";

export default function CreateTripScreen() {
  const addTrip = useTripStore((state) => state.addTrip);

  return (
    <>
      <Stack.Screen options={{ title: "Create trip" }} />

      <TripForm
        onSubmit={(values) => {
          addTrip({
            ...values,
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          });

          router.dismissTo("/");
        }}
      />
    </>
  );
}
