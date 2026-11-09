import type { SQLiteDatabase } from "expo-sqlite";
import {
  type Country,
  getCountries,
} from "../../src/services/countriesService";
import {
  loadCachedCountries,
  saveCachedCountries,
} from "../../src/services/database/countriesStorage";
import {
  loadDailyCountrySelection,
  saveDailyCountrySelection,
} from "../../src/services/database/dailyCountriesStorage";
import {
  removeFavourite,
  saveFavourite,
} from "../../src/services/database/favouritesStorage";
import { useCountriesStore } from "../../src/store/useCountriesStore";

jest.mock("../../src/services/countriesService");
jest.mock("../../src/services/database/countriesStorage");
jest.mock("../../src/services/database/dailyCountriesStorage");
jest.mock("../../src/services/database/favouritesStorage");

const mockGetCountries = jest.mocked(getCountries);
const mockLoadCachedCountries = jest.mocked(loadCachedCountries);
const mockSaveCachedCountries = jest.mocked(saveCachedCountries);
const mockSaveFavourite = jest.mocked(saveFavourite);
const mockRemoveFavourite = jest.mocked(removeFavourite);

const db = {} as SQLiteDatabase;

const italy: Country = {
  code: "IT",
  name: "Italy",
  flag: "🇮🇹",
  capital: "Rome",
  region: "Europe",
  subregion: "Southern Europe",
  population: 59000000,
  languages: ["Italian"],
  currency: "Euro",
  description: "A country in Southern Europe.",
};

beforeEach(() => {
  jest.resetAllMocks();

  useCountriesStore.setState({
    favourites: [],
    favouritesLoaded: false,
  });

  mockSaveFavourite.mockResolvedValue(undefined);
  mockRemoveFavourite.mockResolvedValue(undefined);

  jest.mocked(loadDailyCountrySelection).mockResolvedValue(null);

  jest.mocked(saveDailyCountrySelection).mockResolvedValue(undefined);

  useCountriesStore.setState({
    countries: [],
    recommendations: [],
    recommendationsDate: null,
    loading: false,
    error: null,
  });

  mockLoadCachedCountries.mockResolvedValue([]);

  mockGetCountries.mockRejectedValue(new Error("Network request failed"));
});

test("uses cached countries without calling the API", async () => {
  mockLoadCachedCountries.mockResolvedValue([italy]);

  await useCountriesStore.getState().fetchCountries(db);

  const state = useCountriesStore.getState();

  expect(mockGetCountries).not.toHaveBeenCalled();
  expect(state.countries).toEqual([italy]);
  expect(state.recommendations).toEqual([italy]);
  expect(state.loading).toBe(false);
  expect(state.error).toBeNull();
  expect(mockSaveCachedCountries).not.toHaveBeenCalled();
});

test("shows an error when the API is unavailable and the cache is empty", async () => {
  await useCountriesStore.getState().fetchCountries(db);

  const state = useCountriesStore.getState();

  expect(mockGetCountries).toHaveBeenCalledTimes(1);
  expect(state.countries).toEqual([]);
  expect(state.recommendations).toEqual([]);
  expect(state.loading).toBe(false);
  expect(state.error).toBe("Network request failed");
  expect(mockSaveCachedCountries).not.toHaveBeenCalled();
});

test("adds a favourite and sorts the list alphabetically", async () => {
  const france: Country = {
    ...italy,
    code: "FR",
    name: "France",
  };

  useCountriesStore.setState({ favourites: [italy] });

  await useCountriesStore.getState().toggleFavourite(db, france);

  expect(mockSaveFavourite).toHaveBeenCalledWith(db, france);
  expect(mockRemoveFavourite).not.toHaveBeenCalled();

  expect(useCountriesStore.getState().favourites).toEqual([france, italy]);

  expect(useCountriesStore.getState().isFavourite("FR")).toBe(true);
});

test("removes an existing favourite and keeps the others", async () => {
  const france: Country = {
    ...italy,
    code: "FR",
    name: "France",
  };

  useCountriesStore.setState({
    favourites: [france, italy],
  });

  await useCountriesStore.getState().toggleFavourite(db, italy);

  expect(mockRemoveFavourite).toHaveBeenCalledWith(db, "IT");
  expect(mockSaveFavourite).not.toHaveBeenCalled();

  expect(useCountriesStore.getState().favourites).toEqual([france]);
  expect(useCountriesStore.getState().isFavourite("IT")).toBe(false);
});

test("keeps favourites unchanged when saving fails", async () => {
  const france: Country = {
    ...italy,
    code: "FR",
    name: "France",
  };

  useCountriesStore.setState({ favourites: [france] });

  mockSaveFavourite.mockRejectedValueOnce(new Error("Database unavailable"));

  await expect(
    useCountriesStore.getState().toggleFavourite(db, italy),
  ).rejects.toThrow("Database unavailable");

  expect(useCountriesStore.getState().favourites).toEqual([france]);
});
