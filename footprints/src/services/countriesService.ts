export interface Country {
  code: string;
  name: string;
  flag: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  languages: string[];
  currency: string;
  description: string;
}

interface ApiCountry {
  uuid: string;
  codes?: {
    alpha_2?: string;
  };
  names?: {
    common?: string;
  };
  flag?: {
    emoji?: string;
  };
  capitals?: {
    name: string;
  }[];
  region?: string;
  subregion?: string;
  population?: number;
  languages?: {
    name: string;
  }[];
  currencies?: {
    name: string;
    symbol?: string;
  }[];
  descriptions?: {
    short?: string;
  };
}

interface CountriesResponse {
  data?: {
    objects?: ApiCountry[];
    meta?: {
      more?: boolean;
      total?: number;
    };
  };
  errors?: {
    message?: string;
  }[];
}

const API_URL = "https://api.restcountries.com/countries/v5";

const PAGE_SIZE = 100;

export async function getCountries(): Promise<Country[]> {
  const apiKey = process.env.EXPO_PUBLIC_REST_COUNTRIES_API_KEY;

  if (!apiKey) {
    throw new Error("API key is missing.");
  }

  const countries: Country[] = [];
  let offset = 0;

  while (true) {
    const response = await fetch(
      `${API_URL}?limit=${PAGE_SIZE}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    const result = (await response.json()) as CountriesResponse;

    if (!response.ok) {
      throw new Error(
        result.errors?.[0]?.message ?? "Countries could not be loaded.",
      );
    }

    const objects = result.data?.objects;

    if (!Array.isArray(objects)) {
      throw new Error("Invalid countries API response.");
    }

    const page: Country[] = objects.map((country) => ({
      code: country.codes?.alpha_2 || country.uuid,
      name: country.names?.common ?? "Unknown",
      flag: country.flag?.emoji || "🌍",
      capital: country.capitals?.[0]?.name ?? "Not available",
      region: country.region || "Not available",
      subregion: country.subregion || "Not available",
      population: country.population ?? 0,
      languages: country.languages?.map((language) => language.name) ?? [],
      currency: country.currencies?.[0]?.name ?? "Not available",
      description: country.descriptions?.short ?? "",
    }));

    countries.push(...page);

    if (
      objects.length === 0 ||
      result.data?.meta?.more === false ||
      (result.data?.meta?.more === undefined && objects.length < PAGE_SIZE)
    ) {
      break;
    }

    offset += objects.length;
  }

  const uniqueCountries = Array.from(
    new Map(countries.map((country) => [country.code, country])).values(),
  );

  return uniqueCountries.sort((a, b) => a.name.localeCompare(b.name));
}
