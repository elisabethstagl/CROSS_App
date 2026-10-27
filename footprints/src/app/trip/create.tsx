import { TripForm } from "@/components/TripForm";
import { useTripStore } from "@/store/tripStore";
import { router, Stack } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

export default function CreateTripScreen() {
  const db = useSQLiteContext();
  const addTrip = useTripStore((state) => state.addTrip);

  return (
    <>
      <Stack.Screen options={{ title: "Create trip" }} />

      <TripForm
        onSubmit={async (values) => {
          await addTrip(
            {
              ...values,
              id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            },
            db,
          );

          router.dismissTo("/");
        }}
      />
    </>
  );
}
