import {
  deleteStepFromDatabase,
  deleteTripFromDatabase,
  insertStep,
  insertTrip,
  updateStepInDatabase,
  updateTripInDatabase,
} from "@/services/tripStorage";
import { Step } from "@/types/Step";
import { Trip } from "@/types/Trip";
import { sortByDate } from "@/utils/sortByDate";
import type { SQLiteDatabase } from "expo-sqlite";
import { create } from "zustand";

type TripStore = {
  trips: Trip[];
  steps: Step[];

  addTrip: (trip: Trip, db: SQLiteDatabase) => Promise<void>;
  updateTrip: (trip: Trip, db: SQLiteDatabase) => Promise<void>;
  removeTrip: (id: string, db: SQLiteDatabase) => Promise<void>;

  addStep: (step: Step, db: SQLiteDatabase) => Promise<void>;

  updateStep: (step: Step, db: SQLiteDatabase) => Promise<void>;

  removeStep: (id: string, db: SQLiteDatabase) => Promise<void>;

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
      trips: sortByDate([...state.trips, trip], (item) => item.startDate),
    }));
  },

  updateTrip: async (updatedTrip, db) => {
    await updateTripInDatabase(db, updatedTrip);

    set((state) => ({
      trips: sortByDate(
        state.trips.map((trip) =>
          trip.id === updatedTrip.id ? updatedTrip : trip,
        ),
        (item) => item.startDate,
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

  addStep: async (step, db) => {
    await insertStep(db, step);

    set((state) => ({
      steps: sortByDate([...state.steps, step], (item) => item.date),
    }));
  },

  updateStep: async (updatedStep, db) => {
    await updateStepInDatabase(db, updatedStep);

    set((state) => ({
      steps: sortByDate(
        state.steps.map((step) =>
          step.id === updatedStep.id ? updatedStep : step,
        ),
        (item) => item.date,
      ),
    }));
  },

  removeStep: async (id, db) => {
    await deleteStepFromDatabase(db, id);

    set((state) => ({
      steps: state.steps.filter((step) => step.id !== id),
    }));
  },

  getTripById: (id) => get().trips.find((trip) => trip.id === id),

  getStepsByTripId: (tripId) =>
    get().steps.filter((step) => step.tripId === tripId),
}));
