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

export async function getCountries(): Promise<Country[]> {
  const apiKey = process.env.EXPO_PUBLIC_REST_COUNTRIES_API_KEY;

  if (!apiKey) {
    throw new Error("API-Key fehlt");
  }

  const response = await fetch(
    "https://api.restcountries.com/countries/v5?limit=20",
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.errors?.[0]?.message ?? "Länder konnten nicht geladen werden",
    );
  }

  const countries: Country[] = (result.data.objects as ApiCountry[]).map(
    (country) => ({
      code: country.codes?.alpha_2 || country.uuid,
      name: country.names?.common ?? "Unbekannt",
      flag: country.flag?.emoji || "🌍",
      capital: country.capitals?.[0]?.name ?? "Keine Angabe",
      region: country.region || "Keine Angabe",
      subregion: country.subregion || "Keine Angabe",
      population: country.population ?? 0,
      languages: country.languages?.map((language) => language.name) ?? [],
      currency: country.currencies?.[0]?.name ?? "Keine Angabe",
      description: country.descriptions?.short ?? "",
    }),
  );

  return countries.sort((a, b) => a.name.localeCompare(b.name));
}
