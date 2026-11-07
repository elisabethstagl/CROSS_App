import { create } from "zustand";
import type { SQLiteDatabase } from "expo-sqlite";

import { type Country, getCountries } from "@/services/countriesService";

import {
  loadFavourites,
  saveFavourite,
  removeFavourite,
} from "@/services/database/favouritesStorage";

import {
  loadCachedCountries,
  saveCachedCountries,
} from "@/services/database/countriesStorage";


const RECOMMENDATION_COUNT = 10;

function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

interface CountriesState {
  countries: Country[];
  recommendations: Country[];
  seenCountryCodes: string[];

  loading: boolean;
  error: string | null;

  favourites: Country[];
  favouritesLoaded: boolean;

  fetchCountries: (db: SQLiteDatabase) => Promise<void>;

  discoverMore: () => void;

  loadSavedFavourites: (db: SQLiteDatabase) => Promise<void>;

  isFavourite: (code: string) => boolean;

  toggleFavourite: (db: SQLiteDatabase, country: Country) => Promise<void>;
}

export const useCountriesStore = create<CountriesState>((set, get) => ({
  countries: [],
  recommendations: [],
  seenCountryCodes: [],

  loading: false,
  error: null,

  favourites: [],
  favouritesLoaded: false,

  fetchCountries: async (db) => {
    if (get().loading) return;

    set({ loading: true, error: null });

    let cached: Country[] = [];

    try {
      cached = await loadCachedCountries(db);

      if (cached.length > 0) {
        set({ countries: cached });

        if (get().recommendations.length === 0) {
          get().discoverMore();
        }
      }
    } catch {}

    if (cached.length >= 200) {
      set({ loading: false });
      return;
    }

    try {
      const fetched = await getCountries();

      if (fetched.length === 0) {
        throw new Error("No countries were returned.");
      }

      await saveCachedCountries(db, fetched);

      const allCountries = await loadCachedCountries(db);

      set({
        countries: allCountries,
        loading: false,
        error: null,
      });

      if (get().recommendations.length === 0) {
        get().discoverMore();
      }
    } catch (error) {
      set({
        loading: false,
        error:
          get().countries.length > 0
            ? null
            : error instanceof Error
              ? error.message
              : "Countries could not be loaded.",
      });
    }
  },

  discoverMore: () => {
    const { countries, seenCountryCodes, recommendations } = get();

    if (countries.length === 0) return;

    const seen = new Set(seenCountryCodes);

    let available = countries.filter((country) => !seen.has(country.code));

    if (available.length < RECOMMENDATION_COUNT) {
      const previousCodes = new Set(
        recommendations.map((country) => country.code),
      );

      const alternatives = countries.filter(
        (country) => !previousCodes.has(country.code),
      );

      available =
        alternatives.length >= RECOMMENDATION_COUNT ? alternatives : countries;

      seen.clear();
    }

    const selected = shuffle(available).slice(0, RECOMMENDATION_COUNT);

    selected.forEach((country) => {
      seen.add(country.code);
    });

    set({
      recommendations: selected,
      seenCountryCodes: Array.from(seen),
    });
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
