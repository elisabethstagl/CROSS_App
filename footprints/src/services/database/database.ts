import type { SQLiteDatabase } from "expo-sqlite";

const DATABASE_VERSION = 6;

type ColumnInfo = {
  name: string;
};

async function ensureColumn(
  db: SQLiteDatabase,
  table: "trips" | "steps",
  column: string,
  definition: string,
): Promise<void> {
  const columns = await db.getAllAsync<ColumnInfo>(
    `PRAGMA table_info(${table})`,
  );

  const exists = columns.some((item) => item.name === column);

  if (!exists) {
    await db.execAsync(
      `ALTER TABLE ${table} ADD COLUMN ${column} ${definition};`,
    );
  }
}

export async function initializeDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);

  const result = await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version");

  const currentVersion = result?.user_version ?? 0;

  if (currentVersion > DATABASE_VERSION) {
    throw new Error(
      "This database was created by a newer version of Footprints.",
    );
  }

  if (currentVersion === DATABASE_VERSION) {
    return;
  }

  await db.withExclusiveTransactionAsync(async (tx) => {
    await tx.execAsync(`
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
      `);

    await ensureColumn(tx, "trips", "name", "TEXT NOT NULL DEFAULT ''");

    await ensureColumn(tx, "trips", "startDate", "TEXT NOT NULL DEFAULT ''");

    await ensureColumn(tx, "trips", "endDate", "TEXT NOT NULL DEFAULT ''");

    await ensureColumn(tx, "steps", "name", "TEXT NOT NULL DEFAULT ''");

    await ensureColumn(tx, "steps", "note", "TEXT NOT NULL DEFAULT ''");

    await ensureColumn(tx, "steps", "date", "TEXT NOT NULL DEFAULT ''");

    await ensureColumn(tx, "steps", "latitude", "REAL");

    await ensureColumn(tx, "steps", "longitude", "REAL");

    await ensureColumn(tx, "steps", "photoUri", "TEXT");

    await tx.execAsync(`
        CREATE INDEX IF NOT EXISTS steps_tripId
        ON steps(tripId);
      `);

    await tx.execAsync(`
        CREATE TABLE IF NOT EXISTS favourite_countries (
          code TEXT PRIMARY KEY NOT NULL,
          data TEXT NOT NULL
      );
    `);

    await tx.execAsync(`
      CREATE TABLE IF NOT EXISTS cached_countries (
        code TEXT PRIMARY KEY NOT NULL,
        data TEXT NOT NULL
      );
    `);

    await tx.execAsync(`PRAGMA user_version = ${DATABASE_VERSION};`);
  });

  console.log(
    `Footprints database migrated from version ${currentVersion} to ${DATABASE_VERSION}`,
  );
}
