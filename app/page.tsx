"use client";
import { useState, useEffect, useCallback } from "react";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import UserToggle, { useUser } from "@/components/UserToggle";
import SymptomSelector, { SymptomEntry } from "@/components/SymptomSelector";
import WeatherBlock from "@/components/WeatherBlock";
import PollenBlock from "@/components/PollenBlock";

const WEEKDAYS = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

function toLocalDateString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatLabel(dateStr: string): string {
  const [y, m, day] = dateStr.split("-").map(Number);
  const d = new Date(y, m - 1, day);
  return `${WEEKDAYS[d.getDay()]}, ${day}. ${MONTHS[m - 1]} ${y}`;
}

export default function TodayPage() {
  const todayStr = toLocalDateString(new Date());

  const [users, setUsers] = useState<string[]>([]);
  const [user, setUser] = useUser(users);
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [alreadyRecorded, setAlreadyRecorded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const isToday = selectedDate === todayStr;

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((c) => setUsers([c.user1, c.user2].filter(Boolean)));
  }, []);

  const loadEntry = useCallback((dateStr: string) => {
    setAlreadyRecorded(false);
    setSymptoms([]);
    setNotes("");
    fetch(`/api/entries?date=${dateStr}`)
      .then((r) => r.json())
      .then((entries: Array<{ id: string; symptoms: Array<{ type: string; intensity: number }>; notes: string | null }>) => {
        if (entries.length > 0) {
          const entry = entries[0];
          setAlreadyRecorded(true);
          setSymptoms(entry.symptoms.map((s) => ({ type: s.type, intensity: s.intensity })));
          setNotes(entry.notes ?? "");
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadEntry(selectedDate);
  }, [selectedDate, loadEntry]);

  const shiftDate = (days: number) => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const next = new Date(y, m - 1, d + days);
    const nextStr = toLocalDateString(next);
    if (nextStr <= todayStr) setSelectedDate(nextStr);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordedBy: user, symptoms, notes, date: selectedDate }),
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
          <div className="flex items-center gap-1 mt-0.5">
            <button
              onClick={() => shiftDate(-1)}
              className="p-0.5 text-gray-400 hover:text-gray-700"
              aria-label="Vorheriger Tag"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              max={todayStr}
              onChange={(e) => {
                if (e.target.value && e.target.value <= todayStr) setSelectedDate(e.target.value);
              }}
              className="text-sm text-gray-500 bg-transparent border-none focus:outline-none cursor-pointer"
            />
            <button
              onClick={() => shiftDate(1)}
              disabled={isToday}
              className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
              aria-label="Nächster Tag"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {!isToday && (
            <p className="text-xs text-gray-500 mt-0.5">
              {formatLabel(selectedDate)} —{" "}
              <button
                onClick={() => setSelectedDate(todayStr)}
                className="text-emerald-600 hover:underline"
              >
                Zurück zu heute
              </button>
            </p>
          )}
          {isToday && (
            <p className="text-xs text-gray-500">{formatLabel(selectedDate)}</p>
          )}
        </div>
        <UserToggle users={users} value={user} onChange={setUser} />
      </div>

      {alreadyRecorded && !saved && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-sm text-emerald-700">
          <CheckCircle className="w-4 h-4" />
          {isToday ? "Heute bereits erfasst." : "Eintrag vorhanden."} Änderungen überschreiben den Eintrag.
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

      {isToday && (
        <>
          <section>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Wetter</h2>
            <WeatherBlock />
          </section>

          <section>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Pollen</h2>
            <PollenBlock />
          </section>
        </>
      )}

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
