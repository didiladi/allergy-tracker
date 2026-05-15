"use client";
import { useEffect, useState } from "react";
import { Thermometer, Droplets, Wind } from "lucide-react";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  lat: number;
  lon: number;
  error?: string;
}

export default function WeatherBlock() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/weather")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-gray-400 animate-pulse">Wetterdaten werden geladen…</div>;
  if (!data || data.error) return <div className="text-sm text-gray-400">Wetterdaten nicht verfügbar</div>;

  return (
    <div className="bg-sky-50 rounded-xl p-4">
      <div className="text-sm font-semibold text-sky-800 mb-2">{data.condition}</div>
      <div className="flex gap-4 text-sm text-sky-700">
        <span className="flex items-center gap-1">
          <Thermometer className="w-4 h-4" /> {data.temperature} °C
        </span>
        <span className="flex items-center gap-1">
          <Droplets className="w-4 h-4" /> {data.humidity} %
        </span>
        <span className="flex items-center gap-1">
          <Wind className="w-4 h-4" /> {data.windSpeed} km/h
        </span>
      </div>
    </div>
  );
}
