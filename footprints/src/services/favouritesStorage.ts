import type { SQLiteDatabase } from "expo-sqlite";
import type { Country } from "@/services/countriesService";

type FavouriteRow = {
  data: string;
};

export async function loadFavourites(db: SQLiteDatabase): Promise<Country[]> {
  const rows = await db.getAllAsync<FavouriteRow>(
    "SELECT data FROM favourite_countries",
  );

  return rows
    .map((row) => JSON.parse(row.data) as Country)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function saveFavourite(
  db: SQLiteDatabase,
  country: Country,
): Promise<void> {
  await db.runAsync(
    `INSERT OR REPLACE INTO favourite_countries
     (code, data) VALUES (?, ?)`,
    country.code,
    JSON.stringify(country),
  );
}

export async function removeFavourite(
  db: SQLiteDatabase,
  countryCode: string,
): Promise<void> {
  await db.runAsync(
    "DELETE FROM favourite_countries WHERE code = ?",
    countryCode,
  );
}
