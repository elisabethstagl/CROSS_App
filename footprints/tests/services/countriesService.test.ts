import { getCountries } from "../../src/services/countriesService";

const originalApiKey = process.env.EXPO_PUBLIC_REST_COUNTRIES_API_KEY;

const mockFetch = jest.fn();

function mockResponse(
  objects: unknown[],
  more = false,
  ok = true,
  errors?: { message: string }[],
) {
  return {
    ok,
    json: jest.fn().mockResolvedValue({
      data: {
        objects,
        meta: { more },
      },
      errors,
    }),
  };
}

const italy = {
  uuid: "italy-uuid",
  codes: { alpha_2: "IT" },
  names: { common: "Italy" },
  flag: { emoji: "🇮🇹" },
  capitals: [{ name: "Rome" }],
  region: "Europe",
  subregion: "Southern Europe",
  population: 59000000,
  languages: [{ name: "Italian" }],
  currencies: [{ name: "Euro", symbol: "€" }],
  descriptions: {
    short: "A country in Southern Europe.",
  },
};

const france = {
  uuid: "france-uuid",
  codes: { alpha_2: "FR" },
  names: { common: "France" },
  flag: { emoji: "🇫🇷" },
};

describe("Countries API service", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    process.env.EXPO_PUBLIC_REST_COUNTRIES_API_KEY = "test-api-key";

    global.fetch = mockFetch as typeof fetch;
  });

  afterAll(() => {
    if (originalApiKey === undefined) {
      delete process.env.EXPO_PUBLIC_REST_COUNTRIES_API_KEY;
    } else {
      process.env.EXPO_PUBLIC_REST_COUNTRIES_API_KEY = originalApiKey;
    }
  });

  test("loads countries successfully", async () => {
    mockFetch.mockResolvedValue(mockResponse([italy]));

    const countries = await getCountries();

    expect(countries).toHaveLength(1);
    expect(countries[0].name).toBe("Italy");
    expect(countries[0].code).toBe("IT");
  });

  test("maps all country fields correctly", async () => {
    mockFetch.mockResolvedValue(mockResponse([italy]));

    const countries = await getCountries();

    expect(countries[0]).toEqual({
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
    });
  });

  test("sends the API key in the Authorization header", async () => {
    mockFetch.mockResolvedValue(mockResponse([]));

    await getCountries();

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.restcountries.com/countries/v5?limit=100&offset=0",
      {
        headers: {
          Authorization: "Bearer test-api-key",
        },
      },
    );
  });

  test("returns an empty array when no countries exist", async () => {
    mockFetch.mockResolvedValue(mockResponse([]));

    const countries = await getCountries();

    expect(countries).toEqual([]);
  });

  test("sorts countries alphabetically", async () => {
    mockFetch.mockResolvedValue(mockResponse([italy, france]));

    const countries = await getCountries();

    expect(countries.map((country) => country.name)).toEqual([
      "France",
      "Italy",
    ]);
  });

  test("removes duplicate country codes", async () => {
    mockFetch.mockResolvedValue(mockResponse([italy, italy]));

    const countries = await getCountries();

    expect(countries).toHaveLength(1);
    expect(countries[0].code).toBe("IT");
  });

  test("uses fallback values for missing fields", async () => {
    mockFetch.mockResolvedValue(
      mockResponse([
        {
          uuid: "unknown-uuid",
        },
      ]),
    );

    const countries = await getCountries();

    expect(countries[0]).toEqual({
      code: "unknown-uuid",
      name: "Unknown",
      flag: "🌍",
      capital: "Not available",
      region: "Not available",
      subregion: "Not available",
      population: 0,
      languages: [],
      currency: "Not available",
      description: "",
    });
  });

  test("throws an error when the API key is missing", async () => {
    delete process.env.EXPO_PUBLIC_REST_COUNTRIES_API_KEY;

    await expect(getCountries()).rejects.toThrow("API key is missing.");

    expect(mockFetch).not.toHaveBeenCalled();
  });

  test("throws the API error message", async () => {
    mockFetch.mockResolvedValue(
      mockResponse([], false, false, [{ message: "Unauthorized" }]),
    );

    await expect(getCountries()).rejects.toThrow("Unauthorized");
  });

  test("uses a fallback error message for HTTP errors", async () => {
    mockFetch.mockResolvedValue(mockResponse([], false, false));

    await expect(getCountries()).rejects.toThrow(
      "Countries could not be loaded.",
    );
  });

  test("rejects an invalid API response", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: {},
      }),
    });

    await expect(getCountries()).rejects.toThrow(
      "Invalid countries API response.",
    );
  });

  test("propagates network errors", async () => {
    mockFetch.mockRejectedValue(new Error("Network request failed"));

    await expect(getCountries()).rejects.toThrow("Network request failed");
  });

  test("loads multiple pages using the correct offset", async () => {
    mockFetch
      .mockResolvedValueOnce(mockResponse([italy], true))
      .mockResolvedValueOnce(mockResponse([france], false));

    const countries = await getCountries();

    expect(countries).toHaveLength(2);
    expect(mockFetch).toHaveBeenCalledTimes(2);

    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      "https://api.restcountries.com/countries/v5?limit=100&offset=1",
      {
        headers: {
          Authorization: "Bearer test-api-key",
        },
      },
    );
  });

  test("stops loading when the API returns an empty page", async () => {
    mockFetch
      .mockResolvedValueOnce(mockResponse([italy], true))
      .mockResolvedValueOnce(mockResponse([], true));

    const countries = await getCountries();

    expect(countries).toHaveLength(1);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
