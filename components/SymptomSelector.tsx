"use client";
import { useState } from "react";

export interface SymptomEntry {
  type: string;
  intensity: number;
}

const SYMPTOMS = [
  { type: "husten", label: "Husten", icon: "🤧" },
  { type: "nase", label: "Rinnende Nase", icon: "💧" },
  { type: "augen", label: "Tränende Augen", icon: "👁️" },
  { type: "niesen", label: "Niesen", icon: "🤣" },
  { type: "juckreiz", label: "Juckreiz", icon: "🌿" },
  { type: "hautausschlag", label: "Hautausschlag", icon: "🔴" },
  { type: "muedigkeit", label: "Müdigkeit", icon: "😴" },
];

const INTENSITY_LABELS = ["", "Leicht", "Mäßig", "Mittel", "Stark", "Sehr stark"];

interface Props {
  value: SymptomEntry[];
  onChange: (symptoms: SymptomEntry[]) => void;
}

export default function SymptomSelector({ value, onChange }: Props) {
  const selected = new Map(value.map((s) => [s.type, s.intensity]));

  const toggle = (type: string) => {
    if (selected.has(type)) {
      onChange(value.filter((s) => s.type !== type));
    } else {
      onChange([...value, { type, intensity: 2 }]);
    }
  };

  const setIntensity = (type: string, intensity: number) => {
    onChange(value.map((s) => (s.type === type ? { ...s, intensity } : s)));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {SYMPTOMS.map(({ type, label, icon }) => {
          const active = selected.has(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => toggle(type)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                active
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {value.length > 0 && (
        <div className="space-y-3 pt-1">
          {value.map(({ type, intensity }) => {
            const symptom = SYMPTOMS.find((s) => s.type === type)!;
            return (
              <div key={type} className="bg-emerald-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-emerald-800">
                    {symptom.icon} {symptom.label}
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold">
                    {INTENSITY_LABELS[intensity]}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={intensity}
                  onChange={(e) => setIntensity(type, Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Leicht</span>
                  <span>Sehr stark</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
