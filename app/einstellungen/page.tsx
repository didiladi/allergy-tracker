"use client";
import { useEffect, useState } from "react";
import { Save, MapPin } from "lucide-react";

interface Config {
  lat: number;
  lon: number;
  city: string;
  user1: string;
  user2: string;
}

export default function EinstellungenPage() {
  const [config, setConfig] = useState<Config>({ lat: 48.2092, lon: 16.3728, city: "Wien", user1: "Person 1", user2: "Person 2" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((d) => { setConfig(d); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setConfig((c) => ({ ...c, lat: pos.coords.latitude, lon: pos.coords.longitude }));
    });
  };

  if (loading) return <div className="text-sm text-gray-400 animate-pulse">Wird geladen…</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Einstellungen</h1>

      <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Personen</h2>
        <p className="text-xs text-gray-500">Namen der zwei Personen, die Einträge erfassen können.</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Person 1</label>
            <input
              type="text"
              value={config.user1}
              onChange={(e) => setConfig((c) => ({ ...c, user1: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Name"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Person 2</label>
            <input
              type="text"
              value={config.user2}
              onChange={(e) => setConfig((c) => ({ ...c, user2: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Name"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Standort für Wetter & Pollen</h2>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Ortsname</label>
          <input
            type="text"
            value={config.city}
            onChange={(e) => setConfig((c) => ({ ...c, city: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="z.B. Wien"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Breitengrad</label>
            <input
              type="number"
              step="0.0001"
              value={config.lat}
              onChange={(e) => setConfig((c) => ({ ...c, lat: parseFloat(e.target.value) }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Längengrad</label>
            <input
              type="number"
              step="0.0001"
              value={config.lon}
              onChange={(e) => setConfig((c) => ({ ...c, lon: parseFloat(e.target.value) }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <button
          onClick={useCurrentLocation}
          className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700"
        >
          <MapPin className="w-4 h-4" />
          Aktuellen Standort verwenden
        </button>
      </section>

      <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 text-xs text-amber-700">
        <p className="font-medium mb-1">Hinweis</p>
        <p>Wetter- und Pollendaten werden von Open-Meteo bezogen (kostenlos, kein API-Key erforderlich). Neue Einträge verwenden automatisch den konfigurierten Standort.</p>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold text-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        <Save className="w-4 h-4" />
        {saved ? "Gespeichert!" : saving ? "Wird gespeichert…" : "Einstellungen speichern"}
      </button>
    </div>
  );
}
