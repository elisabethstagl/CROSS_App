import type { SQLiteDatabase } from "expo-sqlite";

import {
  deleteTripFromDatabase,
  insertTrip,
} from "../../src/services/database/tripStorage";
import { useTripStore } from "../../src/store/tripStore";
import type { Step } from "../../src/types/Step";
import type { Trip } from "../../src/types/Trip";

jest.mock("../../src/services/database/tripStorage");

const mockInsertTrip = jest.mocked(insertTrip);
const mockDeleteTrip = jest.mocked(deleteTripFromDatabase);

const db = {} as SQLiteDatabase;

const trip: Trip = {
  id: "trip-1",
  name: "Italy",
  startDate: "2026-06-01",
  endDate: "2026-06-10",
};

const otherTrip: Trip = {
  ...trip,
  id: "trip-2",
  name: "France",
  startDate: "2025-06-01",
  endDate: "2025-06-10",
};

const step: Step = {
  id: "step-1",
  tripId: trip.id,
  name: "Rome",
  note: "",
  date: "2026-06-02",
};

beforeEach(() => {
  jest.resetAllMocks();
  useTripStore.getState().setStoredData([], []);

  mockInsertTrip.mockResolvedValue(undefined);
  mockDeleteTrip.mockResolvedValue(undefined);
});

test("adds a saved trip in the correct order", async () => {
  useTripStore.getState().setStoredData([otherTrip], []);

  await useTripStore.getState().addTrip(trip, db);

  expect(mockInsertTrip).toHaveBeenCalledWith(db, trip);
  expect(useTripStore.getState().trips).toEqual([trip, otherTrip]);
});

test("keeps the store unchanged when saving fails", async () => {
  useTripStore.getState().setStoredData([otherTrip], []);

  mockInsertTrip.mockRejectedValueOnce(new Error("Database unavailable"));

  await expect(useTripStore.getState().addTrip(trip, db)).rejects.toThrow(
    "Database unavailable",
  );

  expect(useTripStore.getState().trips).toEqual([otherTrip]);
});

test("removes a trip and its steps while keeping other trips", async () => {
  const otherStep: Step = {
    ...step,
    id: "step-2",
    tripId: otherTrip.id,
  };

  useTripStore.getState().setStoredData([trip, otherTrip], [step, otherStep]);

  await useTripStore.getState().removeTrip(trip.id, db);

  expect(mockDeleteTrip).toHaveBeenCalledWith(db, trip.id);
  expect(useTripStore.getState().trips).toEqual([otherTrip]);
  expect(useTripStore.getState().steps).toEqual([otherStep]);
});
