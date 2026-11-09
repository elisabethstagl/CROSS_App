import type { Trip } from "@/types/Trip";

export function extendTripDates(trip: Trip, stepDate: string): Trip {
  return {
    ...trip,
    startDate: stepDate < trip.startDate ? stepDate : trip.startDate,
    endDate: stepDate > trip.endDate ? stepDate : trip.endDate,
  };
}
