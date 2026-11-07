import { Alert } from "react-native";

import type { Trip } from "@/types/Trip";
import { formatDisplayDate } from "@/utils/date";
import { extendTripDates } from "@/utils/tripDates";

export function confirmTripDates(
  trip: Trip,
  stepDate: string,
): Promise<boolean> {
  const updatedTrip = extendTripDates(trip, stepDate);

  const unchanged =
    updatedTrip.startDate === trip.startDate &&
    updatedTrip.endDate === trip.endDate;

  if (unchanged) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    Alert.alert(
      "Adjust trip dates?",
      `The step date ${formatDisplayDate(stepDate)} ` +
        `is outside the trip's date range.\n\n` +
        `Would you like to extend the trip to ` +
        `${formatDisplayDate(updatedTrip.startDate)} – ` +
        `${formatDisplayDate(updatedTrip.endDate)}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: "Adjust and save",
          onPress: () => resolve(true),
        },
      ],
      {
        cancelable: true,
        onDismiss: () => resolve(false),
      },
    );
  });
}
