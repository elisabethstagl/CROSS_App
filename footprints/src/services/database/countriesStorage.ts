import type { SQLiteDatabase } from "expo-sqlite";
import type { Country } from "@/services/countriesService";

type CachedCountryRow = {
  data: string;
};

export async function loadCachedCountries(
  db: SQLiteDatabase,
): Promise<Country[]> {
  const rows = await db.getAllAsync<CachedCountryRow>(
    "SELECT data FROM cached_countries",
  );

  const countries: Country[] = [];

  for (const row of rows) {
    try {
      countries.push(JSON.parse(row.data) as Country);
    } catch {}
  }

  return countries.sort((a, b) => a.name.localeCompare(b.name));
}

export async function saveCachedCountries(
  db: SQLiteDatabase,
  countries: Country[],
): Promise<void> {
  await db.withExclusiveTransactionAsync(async (tx) => {
    for (const country of countries) {
      await tx.runAsync(
        `INSERT OR REPLACE INTO cached_countries
         (code, data) VALUES (?, ?)`,
        country.code,
        JSON.stringify(country),
      );
    }
  });
}
