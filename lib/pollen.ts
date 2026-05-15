export interface PollenResult {
  birke: number | null;
  graeser: number | null;
  ambrosia: number | null;
  beifuss: number | null;
  erle: number | null;
  hasel: number | null;
}

function maxOfToday(hourly: number[], times: string[]): number | null {
  const today = new Date().toISOString().slice(0, 10);
  const values = hourly
    .filter((_, i) => times[i]?.startsWith(today))
    .filter((v) => v !== null && v >= 0);
  return values.length > 0 ? Math.max(...values) : null;
}

export async function fetchPollen(lat: number, lon: number): Promise<PollenResult> {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,ragweed_pollen,european_aqi&timezone=Europe%2FVienna`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Pollendaten nicht verfügbar");
  const data = await res.json();
  const h = data.hourly;
  const times: string[] = h.time;
  return {
    birke: maxOfToday(h.birch_pollen, times),
    graeser: maxOfToday(h.grass_pollen, times),
    ambrosia: maxOfToday(h.ragweed_pollen, times),
    beifuss: maxOfToday(h.mugwort_pollen, times),
    erle: maxOfToday(h.alder_pollen, times),
    hasel: null,
  };
}

export function pollenLevel(value: number | null): { label: string; color: string } {
  if (value === null) return { label: "–", color: "bg-gray-100 text-gray-500" };
  if (value < 10) return { label: "Niedrig", color: "bg-green-100 text-green-700" };
  if (value < 30) return { label: "Mittel", color: "bg-yellow-100 text-yellow-700" };
  if (value < 80) return { label: "Hoch", color: "bg-orange-100 text-orange-700" };
  return { label: "Sehr hoch", color: "bg-red-100 text-red-700" };
}
