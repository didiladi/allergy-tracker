"use client";
import { useEffect, useState } from "react";
import { pollenLevel } from "@/lib/pollen";

interface PollenData {
  birke: number | null;
  graeser: number | null;
  ambrosia: number | null;
  beifuss: number | null;
  erle: number | null;
  hasel: number | null;
  error?: string;
}

const LABELS: Record<string, string> = {
  birke: "Birke",
  graeser: "Gräser",
  ambrosia: "Ambrosia",
  beifuss: "Beifuß",
  erle: "Erle",
  hasel: "Hasel",
};

export default function PollenBlock() {
  const [data, setData] = useState<PollenData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pollen")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-gray-400 animate-pulse">Pollendaten werden geladen…</div>;
  if (!data || data.error) return <div className="text-sm text-gray-400">Pollendaten nicht verfügbar</div>;

  const entries = Object.entries(LABELS).map(([key, label]) => ({
    key,
    label,
    value: data[key as keyof PollenData] as number | null,
    level: pollenLevel(data[key as keyof PollenData] as number | null),
  }));

  return (
    <div className="bg-amber-50 rounded-xl p-4">
      <div className="text-sm font-semibold text-amber-800 mb-2">Pollenflug heute</div>
      <div className="flex flex-wrap gap-2">
        {entries.map(({ key, label, level }) => (
          <span
            key={key}
            className={`text-xs px-2 py-1 rounded-full font-medium ${level.color}`}
          >
            {label}: {level.label}
          </span>
        ))}
      </div>
    </div>
  );
}
