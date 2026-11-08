import type { SQLiteDatabase } from "expo-sqlite";

import {
  type Country,
  getCountries,
} from "../../src/services/countriesService";
import { loadCachedCountries } from "../../src/services/database/countriesStorage";
import {
  loadDailyCountrySelection,
  saveDailyCountrySelection,
} from "../../src/services/database/dailyCountriesStorage";
import { useCountriesStore } from "../../src/store/useCountriesStore";

jest.mock("../../src/services/countriesService");
jest.mock("../../src/services/database/countriesStorage");
jest.mock("../../src/services/database/dailyCountriesStorage");

const mockGetCountries = jest.mocked(getCountries);
const mockLoadCached = jest.mocked(loadCachedCountries);
const mockLoadDaily = jest.mocked(loadDailyCountrySelection);
const mockSaveDaily = jest.mocked(saveDailyCountrySelection);

const db = {} as SQLiteDatabase;

const countries: Country[] = Array.from({ length: 20 }, (_, index) => ({
  code: `C${index}`,
  name: `Country ${index}`,
  flag: "🌍",
  capital: "Capital",
  region: "Europe",
  subregion: "",
  population: 1000,
  languages: [],
  currency: "Euro",
  description: "",
}));

const previousSelection = countries.slice(0, 10);
const previousCodes = previousSelection.map((country) => country.code);

beforeEach(() => {
  jest.resetAllMocks();
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2026, 10, 8, 12));

  useCountriesStore.setState({
    countries: [],
    recommendations: [],
    recommendationsDate: null,
    loading: false,
    error: null,
  });

  mockLoadCached.mockResolvedValue(countries);

  mockLoadDaily.mockResolvedValue({
    selectedOn: "2026-11-08",
    countryCodes: previousCodes,
  });

  mockSaveDaily.mockResolvedValue(undefined);
  mockGetCountries.mockRejectedValue(new Error("Offline"));
});

afterEach(() => {
  jest.useRealTimers();
});

test("restores today's selection and keeps it on repeated calls", async () => {
  await useCountriesStore.getState().fetchCountries(db);
  await useCountriesStore.getState().fetchCountries(db);

  expect(useCountriesStore.getState().recommendations).toEqual(
    previousSelection,
  );

  expect(useCountriesStore.getState().recommendationsDate).toBe("2026-11-08");

  expect(mockLoadDaily).toHaveBeenCalledTimes(1);
  expect(mockSaveDaily).not.toHaveBeenCalled();
  expect(mockGetCountries).not.toHaveBeenCalled();
});

test("creates and saves a new selection on the next day without calling the API", async () => {
  await useCountriesStore.getState().fetchCountries(db);

  jest.setSystemTime(new Date(2026, 10, 9, 12));

  await useCountriesStore.getState().fetchCountries(db);

  const state = useCountriesStore.getState();
  const codes = state.recommendations.map((country) => country.code);

  expect(codes).toHaveLength(10);
  expect(codes.every((code) => !previousCodes.includes(code))).toBe(true);

  expect(state.recommendationsDate).toBe("2026-11-09");
  expect(state.error).toBeNull();

  expect(mockSaveDaily).toHaveBeenCalledTimes(1);
  expect(mockSaveDaily).toHaveBeenCalledWith(db, {
    selectedOn: "2026-11-09",
    countryCodes: codes,
  });

  expect(mockGetCountries).not.toHaveBeenCalled();
});

test("Discover more saves a different selection for the same day", async () => {
  await useCountriesStore.getState().fetchCountries(db);

  await useCountriesStore.getState().discoverMore(db);

  const state = useCountriesStore.getState();
  const codes = state.recommendations.map((country) => country.code);

  expect(codes).toHaveLength(10);
  expect(codes.every((code) => !previousCodes.includes(code))).toBe(true);

  expect(state.recommendationsDate).toBe("2026-11-08");
  expect(state.error).toBeNull();

  expect(mockSaveDaily).toHaveBeenCalledTimes(1);
  expect(mockSaveDaily).toHaveBeenCalledWith(db, {
    selectedOn: "2026-11-08",
    countryCodes: codes,
  });

  expect(mockGetCountries).not.toHaveBeenCalled();
});
