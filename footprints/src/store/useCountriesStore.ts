import { create } from "zustand";
import { Country, getCountries } from "../services/countriesService";

interface CountriesState {
  countries: Country[];
  loading: boolean;
  error: string | null;

  fetchCountries: () => Promise<void>;
}

export const useCountriesStore = create<CountriesState>((set) => ({
  countries: [],
  loading: false,
  error: null,

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
          error instanceof Error
            ? error.message
            : "Fehler beim Laden der Länder",
        loading: false,
      });
    }
  },
}));
