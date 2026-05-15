"use client";
import { useState } from "react";
import { Download } from "lucide-react";

function defaultFrom() {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().slice(0, 10);
}

function defaultTo() {
  return new Date().toISOString().slice(0, 10);
}

export default function ExportPage() {
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [format, setFormat] = useState<"csv" | "json">("csv");

  const downloadUrl = `/api/export?format=${format}&from=${from}&to=${to}`;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Daten exportieren</h1>
      <p className="text-sm text-gray-500">
        Exportiere deine Einträge als CSV oder JSON — z.B. für den Arzt oder zur KI-Analyse.
      </p>

      <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Zeitraum von</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Zeitraum bis</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
          <div className="flex gap-3">
            {(["csv", "json"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  format === f
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      <a
        href={downloadUrl}
        download
        className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors"
      >
        <Download className="w-4 h-4" />
        {format.toUpperCase()} herunterladen
      </a>

      <div className="bg-gray-100 rounded-xl p-4 text-xs text-gray-500 space-y-1">
        <p className="font-medium text-gray-600">CSV enthält:</p>
        <p>Datum, Erfasst von, Symptome (je mit Intensität 1–5), Notizen, Wetter, Pollenwerte</p>
      </div>
    </div>
  );
}
