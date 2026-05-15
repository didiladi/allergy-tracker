export interface WeatherResult {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
}

const WMO_CODES: Record<number, string> = {
  0: "Klar",
  1: "Überwiegend klar", 2: "Teilweise bewölkt", 3: "Bedeckt",
  45: "Nebel", 48: "Raureif",
  51: "Leichter Nieselregen", 53: "Nieselregen", 55: "Starker Nieselregen",
  61: "Leichter Regen", 63: "Regen", 65: "Starker Regen",
  71: "Leichter Schnee", 73: "Schnee", 75: "Starker Schneefall",
  80: "Leichte Schauer", 81: "Schauer", 82: "Starke Schauer",
  95: "Gewitter", 96: "Gewitter mit Hagel", 99: "Starkes Gewitter",
};

export async function fetchWeather(lat: number, lon: number): Promise<WeatherResult> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Europe%2FVienna`;
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error("Wetterdaten nicht verfügbar");
  const data = await res.json();
  const c = data.current;
  return {
    temperature: Math.round(c.temperature_2m * 10) / 10,
    humidity: c.relative_humidity_2m,
    windSpeed: Math.round(c.wind_speed_10m * 10) / 10,
    condition: WMO_CODES[c.weather_code] ?? "Unbekannt",
  };
}
