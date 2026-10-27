import type { SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);

  const result = await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version");

  const currentVersion = result?.user_version ?? 0;

  if (currentVersion >= 1) {
    return;
  }

  await db.withTransactionAsync(async () => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS steps (
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

      CREATE INDEX IF NOT EXISTS steps_tripId
        ON steps(tripId);

      PRAGMA user_version = 1;
    `);
  });
}
