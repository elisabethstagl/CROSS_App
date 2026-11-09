import { type Country, getCountries } from "@/services/countriesService";
import {
  loadCachedCountries,
  saveCachedCountries,
} from "@/services/database/countriesStorage";
import {
  loadFavourites,
  removeFavourite,
  saveFavourite,
} from "@/services/database/favouritesStorage";
import { toStorageDate } from "@/utils/date";
import type { SQLiteDatabase } from "expo-sqlite";
import { create } from "zustand";

import {
  loadDailyCountrySelection,
  saveDailyCountrySelection,
} from "@/services/database/dailyCountriesStorage";

const RECOMMENDATION_COUNT = 10;

function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function selectRecommendations(
  countries: Country[],
  previous: Country[],
): Country[] {
  const previousCodes = new Set(previous.map((country) => country.code));

  const alternatives = countries.filter(
    (country) => !previousCodes.has(country.code),
  );

  const count = Math.min(RECOMMENDATION_COUNT, countries.length);

  const pool = alternatives.length >= count ? alternatives : countries;

  return shuffle(pool).slice(0, count);
}

interface CountriesState {
  countries: Country[];
  recommendations: Country[];
  recommendationsDate: string | null;

  loading: boolean;
  error: string | null;

  favourites: Country[];
  favouritesLoaded: boolean;

  fetchCountries: (
    db: SQLiteDatabase,
    forceNewSelection?: boolean,
  ) => Promise<void>;

  discoverMore: (db: SQLiteDatabase) => Promise<void>;

  loadSavedFavourites: (db: SQLiteDatabase) => Promise<void>;

  isFavourite: (code: string) => boolean;

  toggleFavourite: (db: SQLiteDatabase, country: Country) => Promise<void>;
}

export const useCountriesStore = create<CountriesState>((set, get) => ({
  countries: [],
  recommendations: [],
  recommendationsDate: null,
  loading: false,
  error: null,
  favourites: [],
  favouritesLoaded: false,

  fetchCountries: async (db, forceNewSelection = false) => {
    if (get().loading) return;

    const today = toStorageDate(new Date());

    if (
      !forceNewSelection &&
      get().recommendationsDate === today &&
      get().recommendations.length > 0
    ) {
      return;
    }

    set({ loading: true, error: null });

    try {
      let countries = get().countries;

      if (countries.length === 0) {
        countries = await loadCachedCountries(db);

        if (countries.length === 0) {
          countries = await getCountries();

          if (countries.length === 0) {
            throw new Error("No countries were returned.");
          }

          await saveCachedCountries(db, countries);
        }

        set({ countries });
      }

      const saved = await loadDailyCountrySelection(db);

      const countriesByCode = new Map(
        countries.map((country) => [country.code, country]),
      );

      const savedCountries = saved
        ? saved.countryCodes
            .map((code) => countriesByCode.get(code))
            .filter((country): country is Country => country !== undefined)
        : [];

      if (saved && savedCountries.length > 0) {
        set({
          recommendations: savedCountries,
          recommendationsDate: saved.selectedOn,
        });
      }

      const count = Math.min(RECOMMENDATION_COUNT, countries.length);

      if (
        !forceNewSelection &&
        saved?.selectedOn === today &&
        savedCountries.length === count
      ) {
        return;
      }

      const selected = selectRecommendations(countries, get().recommendations);

      await saveDailyCountrySelection(db, {
        selectedOn: today,
        countryCodes: selected.map((country) => country.code),
      });

      set({
        recommendations: selected,
        recommendationsDate: today,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Recommendations could not be loaded.",
      });
    } finally {
      set({ loading: false });
    }
  },

  discoverMore: async (db) => {
    await get().fetchCountries(db, true);
  },

  loadSavedFavourites: async (db) => {
    const favourites = await loadFavourites(db);

    set({
      favourites,
      favouritesLoaded: true,
    });
  },

  isFavourite: (code) => {
    return get().favourites.some((country) => country.code === code);
  },

  toggleFavourite: async (db, country) => {
    const alreadySaved = get().favourites.some(
      (item) => item.code === country.code,
    );

    if (alreadySaved) {
      await removeFavourite(db, country.code);

      set((state) => ({
        favourites: state.favourites.filter(
          (item) => item.code !== country.code,
        ),
      }));
    } else {
      await saveFavourite(db, country);

      set((state) => ({
        favourites: [...state.favourites, country].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      }));
    }
  },
}));
