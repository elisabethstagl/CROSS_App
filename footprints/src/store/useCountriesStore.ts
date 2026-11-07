import { create } from "zustand";
import type { SQLiteDatabase } from "expo-sqlite";

import { type Country, getCountries } from "@/services/countriesService";

import {
  loadFavourites,
  saveFavourite,
  removeFavourite,
} from "@/services/favouritesStorage";

interface CountriesState {
  countries: Country[];
  loading: boolean;
  error: string | null;

  favourites: Country[];
  favouritesLoaded: boolean;

  fetchCountries: () => Promise<void>;
  loadSavedFavourites: (db: SQLiteDatabase) => Promise<void>;
  isFavourite: (code: string) => boolean;
  toggleFavourite: (db: SQLiteDatabase, country: Country) => Promise<void>;
}

export const useCountriesStore = create<CountriesState>((set, get) => ({
  countries: [],
  loading: false,
  error: null,

  favourites: [],
  favouritesLoaded: false,

  fetchCountries: async () => {
    set({ loading: true, error: null });

    try {
      const data = await getCountries();

      set({
        countries: data,
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Could not load countries.",
        loading: false,
      });
    }
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
