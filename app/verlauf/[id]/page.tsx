"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import SymptomSelector, { SymptomEntry } from "@/components/SymptomSelector";
import UserToggle, { useUser } from "@/components/UserToggle";

const MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const WEEKDAYS = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

export default function EntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [users, setUsers] = useState<string[]>([]);
  const [user, setUser] = useUser(users);
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [notes, setNotes] = useState("");
  const [entry, setEntry] = useState<{ date: string; weather: unknown; pollen: unknown } | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((c) => setUsers([c.user1, c.user2].filter(Boolean)));
  }, []);

  useEffect(() => {
    fetch(`/api/entries/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        setEntry(d);
        setUser(d.recordedBy);
        setSymptoms(d.symptoms.map((s: { type: string; intensity: number }) => ({ type: s.type, intensity: s.intensity })));
        setNotes(d.notes ?? "");
      })
      .catch(() => router.push("/verlauf"));
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`/api/entries/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recordedBy: user, symptoms, notes }),
    });
    setSaving(false);
    router.push("/verlauf");
  };

  const handleDelete = async () => {
    if (!confirm("Eintrag wirklich löschen?")) return;
    setDeleting(true);
    await fetch(`/api/entries/${params.id}`, { method: "DELETE" });
    router.push("/verlauf");
  };

  if (!entry) return <div className="text-sm text-gray-400 animate-pulse">Wird geladen…</div>;

  const d = new Date(entry.date as string);
  const dateLabel = `${WEEKDAYS[d.getDay()]}, ${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/verlauf")} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{dateLabel}</h1>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <UserToggle users={users} value={user} onChange={setUser} />
        <button onClick={handleDelete} disabled={deleting} className="text-red-400 hover:text-red-600 p-1">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Symptome</h2>
        <SymptomSelector value={symptoms} onChange={setSymptoms} />
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-1">Notizen</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
      </section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold text-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        {saving ? "Wird gespeichert…" : "Änderungen speichern"}
      </button>
    </div>
  );
}
