export interface Country {
  cca3: string;
  name: {
    common: string;
  };
  capital?: string[];
  region: string;
  flags: {
    png: string;
  };
}

export async function getCountries(): Promise<Country[]> {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,cca3,capital,region,flags",
  );

  if (!response.ok) {
    throw new Error("Länder konnten nicht geladen werden");
  }

  const countries: Country[] = await response.json();

  return countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
}
