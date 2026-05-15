import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SYMPTOM_TYPES = ["husten", "nase", "augen", "niesen", "juckreiz", "hautausschlag", "muedigkeit"];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") ?? "csv";
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const entries = await prisma.entry.findMany({
    where: {
      date: {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      },
    },
    include: { symptoms: true, weather: true, pollen: true },
    orderBy: { date: "asc" },
  });

  if (format === "json") {
    return new NextResponse(JSON.stringify(entries, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": "attachment; filename=allergy-tracker-export.json",
      },
    });
  }

  const header = [
    "datum", "erfasst_von",
    ...SYMPTOM_TYPES.map((t) => `symptom_${t}`),
    "notizen",
    "temperatur_c", "luftfeuchtigkeit_pct", "windgeschwindigkeit_kmh", "wetterlage",
    "pollen_birke", "pollen_graeser", "pollen_ambrosia", "pollen_beifuss", "pollen_erle", "pollen_hasel",
  ];

  const rows = entries.map((e) => {
    const symptomMap = Object.fromEntries(e.symptoms.map((s) => [s.type, s.intensity]));
    return [
      e.date.toISOString().slice(0, 10),
      e.recordedBy,
      ...SYMPTOM_TYPES.map((t) => symptomMap[t] ?? ""),
      e.notes ?? "",
      e.weather?.temperature ?? "",
      e.weather?.humidity ?? "",
      e.weather?.windSpeed ?? "",
      e.weather?.condition ?? "",
      e.pollen?.birke ?? "",
      e.pollen?.graeser ?? "",
      e.pollen?.ambrosia ?? "",
      e.pollen?.beifuss ?? "",
      e.pollen?.erle ?? "",
      e.pollen?.hasel ?? "",
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`);
  });

  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=allergy-tracker-export.csv",
    },
  });
}
