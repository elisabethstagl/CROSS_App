import {
  deleteTripFromDatabase,
  insertTrip,
  updateTripInDatabase,
} from "@/services/tripStorage";
import { Step } from "@/types/Step";
import { Trip } from "@/types/Trip";
import type { SQLiteDatabase } from "expo-sqlite";
import { create } from "zustand";

type TripStore = {
  trips: Trip[];
  steps: Step[];

  addTrip: (trip: Trip, db: SQLiteDatabase) => Promise<void>;
  updateTrip: (trip: Trip, db: SQLiteDatabase) => Promise<void>;
  removeTrip: (id: string, db: SQLiteDatabase) => Promise<void>;

  addStep: (step: Step) => void;
  updateStep: (step: Step) => void;
  removeStep: (id: string) => void;

  getTripById: (id: string) => Trip | undefined;
  getStepsByTripId: (tripId: string) => Step[];

  setStoredData: (trips: Trip[], steps: Step[]) => void;
};

export const useTripStore = create<TripStore>((set, get) => ({
  trips: [],
  steps: [],

  setStoredData: (trips, steps) =>
    set({
      trips,
      steps,
    }),

  addTrip: async (trip, db) => {
    await insertTrip(db, trip);

    set((state) => ({
      trips: [...state.trips, trip],
    }));
  },

  updateTrip: async (updatedTrip, db) => {
    await updateTripInDatabase(db, updatedTrip);

    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === updatedTrip.id ? updatedTrip : trip,
      ),
    }));
  },

  removeTrip: async (id, db) => {
    await deleteTripFromDatabase(db, id);

    set((state) => ({
      trips: state.trips.filter((trip) => trip.id !== id),

      steps: state.steps.filter((step) => step.tripId !== id),
    }));
  },

  addStep: (step) =>
    set((state) => ({
      steps: [...state.steps, step],
    })),

  updateStep: (updatedStep) =>
    set((state) => ({
      steps: state.steps.map((step) =>
        step.id === updatedStep.id ? updatedStep : step,
      ),
    })),

  removeStep: (id) =>
    set((state) => ({
      steps: state.steps.filter((step) => step.id !== id),
    })),

  getTripById: (id) => get().trips.find((trip) => trip.id === id),

  getStepsByTripId: (tripId) =>
    get().steps.filter((step) => step.tripId === tripId),
}));
