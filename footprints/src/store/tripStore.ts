import { create } from "zustand";
import { Trip } from "@/types/Trip";
import { Step } from "@/types/Step";

type TripStore = {
  trips: Trip[];
  steps: Step[];

  addTrip: (trip: Trip) => void;
  updateTrip: (trip: Trip) => void;
  removeTrip: (id: string) => void;

  addStep: (step: Step) => void;
  updateStep: (step: Step) => void;
  removeStep: (id: string) => void;

  getTripById: (id: string) => Trip | undefined;
  getStepsByTripId: (tripId: string) => Step[];
};

export const useTripStore = create<TripStore>((set, get) => ({
  trips: [
  {
    id: "1",
    name: "Italy 2026",
    startDate: "2026-07-10",
    endDate: "2026-07-20",
  },
  {
    id: "2",
    name: "South Korea 2025",
    startDate: "2025-09-01",
    endDate: "2025-09-15",
  },
],

steps: [
  {
    id: "1",
    tripId: "1",
    note: "Visited the Colosseum",
    date: "2026-07-12",
    latitude: 41.8902,
    longitude: 12.4922,
  },
],

  addTrip: (trip) =>
    set((state) => ({
      trips: [...state.trips, trip],
    })),

  updateTrip: (updatedTrip) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === updatedTrip.id ? updatedTrip : trip
      ),
    })),

  removeTrip: (id) =>
    set((state) => ({
      trips: state.trips.filter((trip) => trip.id !== id),

      // Also remove all steps belonging to this trip
      steps: state.steps.filter((step) => step.tripId !== id),
    })),

  addStep: (step) =>
    set((state) => ({
      steps: [...state.steps, step],
    })),

  updateStep: (updatedStep) =>
    set((state) => ({
      steps: state.steps.map((step) =>
        step.id === updatedStep.id ? updatedStep : step
      ),
    })),

  removeStep: (id) =>
    set((state) => ({
      steps: state.steps.filter((step) => step.id !== id),
    })),

  getTripById: (id) =>
    get().trips.find((trip) => trip.id === id),

  getStepsByTripId: (tripId) =>
    get().steps.filter((step) => step.tripId === tripId),
}));