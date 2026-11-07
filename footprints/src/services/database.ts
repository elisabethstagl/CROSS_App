
import type { SQLiteDatabase } from "expo-sqlite";

const DATABASE_VERSION = 3;

export async function initializeDatabase(
  db: SQLiteDatabase
): Promise<void> {
  // Enable SQLite performance settings
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);

  // Get current database version
  const result = await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version");

  const currentVersion = result?.user_version ?? 0;

  // Database is already initialized
  if (currentVersion >= DATABASE_VERSION) {
    return;
  }

  // Reset old tables and create the correct schema.
  // WARNING: This deletes existing trips and steps.
  await db.withTransactionAsync(async () => {
    // Delete old tables
    await db.execAsync(`
      DROP TABLE IF EXISTS steps;
      DROP TABLE IF EXISTS trips;
    `);

    // Create trips table
    await db.execAsync(`
      CREATE TABLE trips (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT NOT NULL
      );
    `);

    // Create steps table
    await db.execAsync(`
      CREATE TABLE steps (
        id TEXT PRIMARY KEY NOT NULL,
        tripId TEXT NOT NULL,
        name TEXT NOT NULL,
        note TEXT NOT NULL DEFAULT '',
        date TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        photoUri TEXT,

        FOREIGN KEY (tripId)
          REFERENCES trips(id)
          ON DELETE CASCADE
      );
    `);

    // Create index for faster queries
    await db.execAsync(`
      CREATE INDEX steps_tripId
      ON steps(tripId);
    `);

    // Save database version
    await db.execAsync(`
      PRAGMA user_version = 3;
    `);
  });

  console.log("SQLite database initialized successfully");
}
