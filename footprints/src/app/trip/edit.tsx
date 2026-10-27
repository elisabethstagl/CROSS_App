import { TripForm } from "@/components/TripForm";
import { Colors } from "@/constants/theme";
import { useTripStore } from "@/store/tripStore";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Text, View } from "react-native";

export default function EditTripScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const trip = useTripStore((state) =>
    state.trips.find((item) => item.id === id),
  );

  const updateTrip = useTripStore((state) => state.updateTrip);
  const db = useSQLiteContext();

  if (!trip) {
    return (
      <View
        style={{
          flex: 1,
          padding: 24,
          backgroundColor: Colors.light.background,
        }}
      >
        <Stack.Screen options={{ title: "Edit trip" }} />

        <Text style={{ color: Colors.light.text }}>Trip not found.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Edit trip" }} />

      <TripForm
        key={trip.id}
        initialValues={trip}
        onSubmit={async (values) => {
          await updateTrip(
            {
              ...trip,
              ...values,
            },
            db,
          );

          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/");
          }
        }}
      />
    </>
  );
}
