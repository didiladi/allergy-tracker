"use client";
import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import UserToggle, { useUser } from "@/components/UserToggle";
import SymptomSelector, { SymptomEntry } from "@/components/SymptomSelector";
import WeatherBlock from "@/components/WeatherBlock";
import PollenBlock from "@/components/PollenBlock";

const WEEKDAYS = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

export default function TodayPage() {
  const [users, setUsers] = useState<string[]>([]);
  const [user, setUser] = useUser(users);
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [alreadyRecorded, setAlreadyRecorded] = useState(false);

  const now = new Date();
  const dateLabel = `${WEEKDAYS[now.getDay()]}, ${now.getDate()}. ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((c) => setUsers([c.user1, c.user2].filter(Boolean)));
  }, []);

  useEffect(() => {
    fetch("/api/status/today")
      .then((r) => r.json())
      .then((d) => {
        if (d.recorded && d.entryId) {
          setAlreadyRecorded(true);
          return fetch(`/api/entries/${d.entryId}`);
        }
      })
      .then((r) => r?.json())
      .then((entry) => {
        if (entry) {
          setSymptoms(entry.symptoms.map((s: { type: string; intensity: number }) => ({ type: s.type, intensity: s.intensity })));
          setNotes(entry.notes ?? "");
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordedBy: user, symptoms, notes }),
      });
      setSaved(true);
      setAlreadyRecorded(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tageseintrag</h1>
          <p className="text-sm text-gray-500">{dateLabel}</p>
        </div>
        <UserToggle users={users} value={user} onChange={setUser} />
      </div>

      {alreadyRecorded && !saved && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-sm text-emerald-700">
          <CheckCircle className="w-4 h-4" />
          Heute bereits erfasst. Änderungen überschreiben den Eintrag.
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2 bg-emerald-100 border border-emerald-300 rounded-xl px-4 py-3 text-sm text-emerald-800 font-semibold">
          <CheckCircle className="w-5 h-5" />
          Eintrag gespeichert!
        </div>
      )}

      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Symptome</h2>
        <SymptomSelector value={symptoms} onChange={setSymptoms} />
        {symptoms.length === 0 && (
          <p className="text-xs text-gray-400 mt-2">Keine Symptome? Eintrag trotzdem speichern.</p>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Wetter</h2>
        <WeatherBlock />
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Pollen</h2>
        <PollenBlock />
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-1">Notizen</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optionale Anmerkungen…"
          rows={3}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
      </section>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold text-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        {saving ? "Wird gespeichert…" : alreadyRecorded ? "Eintrag aktualisieren" : "Eintrag speichern"}
      </button>
    </div>
  );
}
