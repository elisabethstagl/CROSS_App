import type { Step } from "@/types/Step";
import type { Trip } from "@/types/Trip";
import type { SQLiteDatabase } from "expo-sqlite";

type StepRow = Omit<Step, "latitude" | "longitude" | "photoUri"> & {
  latitude: number | null;
  longitude: number | null;
  photoUri: string | null;
};

export async function loadTripData(
  db: SQLiteDatabase,
): Promise<{ trips: Trip[]; steps: Step[] }> {
  const trips = await db.getAllAsync<Trip>(`
    SELECT id, name, startDate, endDate
    FROM trips
    ORDER BY startDate DESC, id ASC
  `);

  const rows = await db.getAllAsync<StepRow>(`
    SELECT
      id,
      tripId,
      name,
      note,
      date,
      latitude,
      longitude,
      photoUri
    FROM steps
    ORDER BY date DESC, id ASC
  `);

  const steps: Step[] = rows.map((row) => ({
    ...row,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    photoUri: row.photoUri ?? undefined,
  }));

  return { trips, steps };
}

export async function insertTrip(
  db: SQLiteDatabase,
  trip: Trip,
): Promise<void> {
  await db.runAsync(
    `INSERT INTO trips (id, name, startDate, endDate)
     VALUES (?, ?, ?, ?)`,
    trip.id,
    trip.name,
    trip.startDate,
    trip.endDate,
  );
}

export async function updateTripInDatabase(
  db: SQLiteDatabase,
  trip: Trip,
): Promise<void> {
  const result = await db.runAsync(
    `UPDATE trips
     SET name = ?, startDate = ?, endDate = ?
     WHERE id = ?`,
    trip.name,
    trip.startDate,
    trip.endDate,
    trip.id,
  );

  if (result.changes === 0) {
    throw new Error("Trip not found in database.");
  }
}

export async function deleteTripFromDatabase(
  db: SQLiteDatabase,
  id: string,
): Promise<void> {
  await db.runAsync("DELETE FROM trips WHERE id = ?", id);
}

export async function insertStep(
  db: SQLiteDatabase,
  step: Step,
): Promise<void> {
  await db.runAsync(
    `INSERT INTO steps (
      id, tripId, name, note, date,
      latitude, longitude, photoUri
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    step.id,
    step.tripId,
    step.name,
    step.note ?? "",
    step.date,
    step.latitude ?? null,
    step.longitude ?? null,
    step.photoUri ?? null,
  );
}

export async function updateStepInDatabase(
  db: SQLiteDatabase,
  step: Step,
): Promise<void> {
  const result = await db.runAsync(
    `UPDATE steps
     SET name = ?,
         note = ?,
         date = ?,
         latitude = ?,
         longitude = ?,
         photoUri = ?
     WHERE id = ? AND tripId = ?`,
    step.name,
    step.note ?? "",
    step.date,
    step.latitude ?? null,
    step.longitude ?? null,
    step.photoUri ?? null,
    step.id,
    step.tripId,
  );

  if (result.changes === 0) {
    throw new Error("Step not found in database.");
  }
}

export async function deleteStepFromDatabase(
  db: SQLiteDatabase,
  id: string,
): Promise<void> {
  await db.runAsync("DELETE FROM steps WHERE id = ?", id);
}
