"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Symptom {
  type: string;
  intensity: number;
}

interface Entry {
  id: string;
  date: string;
  recordedBy: string;
  symptoms: Symptom[];
  weather: { temperature: number; condition: string } | null;
  pollen: { birke: number | null; graeser: number | null } | null;
  notes: string | null;
}

const SYMPTOM_LABELS: Record<string, string> = {
  husten: "Husten",
  nase: "Rinnende Nase",
  augen: "Tränende Augen",
  niesen: "Niesen",
  juckreiz: "Juckreiz",
  hautausschlag: "Hautausschlag",
  muedigkeit: "Müdigkeit",
};

const INTENSITY_DOTS = ["", "●○○○○", "●●○○○", "●●●○○", "●●●●○", "●●●●●"];

const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const MONTHS = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()}. ${MONTHS[d.getMonth()]}`;
}

export default function VerlaufPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const from = new Date();
    from.setDate(from.getDate() - 30);
    fetch(`/api/entries?from=${from.toISOString().slice(0, 10)}`)
      .then((r) => r.json())
      .then((d) => { setEntries(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-gray-400 animate-pulse">Wird geladen…</div>;

  if (entries.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-sm">Noch keine Einträge vorhanden.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-emerald-600 hover:underline">Ersten Eintrag erstellen →</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Verlauf</h1>
      <p className="text-sm text-gray-500">{entries.length} Einträge der letzten 30 Tage</p>

      <div className="space-y-2">
        {entries.map((entry) => (
          <Link
            key={entry.id}
            href={`/verlauf/${entry.id}`}
            className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-emerald-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 text-sm">{formatDate(entry.date)}</span>
                  <span className="text-xs text-gray-400">{entry.recordedBy}</span>
                </div>
                {entry.symptoms.length === 0 ? (
                  <p className="text-xs text-gray-400 mt-1">Keine Symptome</p>
                ) : (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.symptoms.map((s) => (
                      <span key={s.type} className="text-xs bg-emerald-50 text-emerald-700 rounded-full px-2 py-0.5">
                        {SYMPTOM_LABELS[s.type] ?? s.type} {INTENSITY_DOTS[s.intensity]}
                      </span>
                    ))}
                  </div>
                )}
                {entry.weather && (
                  <p className="text-xs text-gray-400 mt-1">{entry.weather.condition} · {entry.weather.temperature} °C</p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
