import type { SQLiteDatabase } from "expo-sqlite";

export type DailyCountrySelection = {
  selectedOn: string;
  countryCodes: string[];
};

export async function loadDailyCountrySelection(
  db: SQLiteDatabase,
): Promise<DailyCountrySelection | null> {
  const row = await db.getFirstAsync<{
    selectedOn: string;
    countryCodes: string;
  }>(
    `SELECT selectedOn, countryCodes
     FROM daily_country_selection
     WHERE id = 1`,
  );

  if (!row) return null;

  try {
    const codes: unknown = JSON.parse(row.countryCodes);

    if (
      !Array.isArray(codes) ||
      !codes.every((code: unknown) => typeof code === "string") ||
      new Set(codes).size !== codes.length
    ) {
      return null;
    }

    return {
      selectedOn: row.selectedOn,
      countryCodes: codes,
    };
  } catch {
    return null;
  }
}

export async function saveDailyCountrySelection(
  db: SQLiteDatabase,
  selection: DailyCountrySelection,
): Promise<void> {
  await db.runAsync(
    `INSERT OR REPLACE INTO daily_country_selection
     (id, selectedOn, countryCodes)
     VALUES (1, ?, ?)`,
    selection.selectedOn,
    JSON.stringify(selection.countryCodes),
  );
}
