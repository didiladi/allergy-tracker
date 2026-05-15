import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchWeather } from "@/lib/weather";
import { fetchPollen } from "@/lib/pollen";

function dayBounds(dateStr: string): { start: Date; end: Date } {
  const start = new Date(dateStr);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");

  let dateFilter: object = {};
  if (date) {
    const { start, end } = dayBounds(date);
    dateFilter = { gte: start, lt: end };
  } else {
    dateFilter = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    };
  }

  const entries = await prisma.entry.findMany({
    where: { date: dateFilter },
    include: { symptoms: true, weather: true, pollen: true },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { recordedBy, symptoms, notes, weather, pollen, date: dateStr } = body;

  const { start, end } = dateStr
    ? dayBounds(dateStr)
    : (() => {
        const s = new Date();
        s.setHours(0, 0, 0, 0);
        const e = new Date(s);
        e.setDate(e.getDate() + 1);
        return { start: s, end: e };
      })();

  const existing = await prisma.entry.findFirst({
    where: { date: { gte: start, lt: end } },
    include: { symptoms: true },
  });

  const config = await prisma.config.findUnique({ where: { id: "default" } });
  const lat = config?.lat ?? 48.2092;
  const lon = config?.lon ?? 16.3728;

  const isToday = start.toDateString() === (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })().toDateString();

  let weatherData = weather;
  let pollenData = pollen;

  if (!weatherData && isToday) {
    try { weatherData = { ...await fetchWeather(lat, lon), lat, lon }; } catch {}
  }
  if (!pollenData && isToday) {
    try { pollenData = { ...await fetchPollen(lat, lon), lat, lon }; } catch {}
  }

  if (existing) {
    await prisma.symptom.deleteMany({ where: { entryId: existing.id } });
    const entry = await prisma.entry.update({
      where: { id: existing.id },
      data: {
        recordedBy,
        notes,
        symptoms: {
          create: symptoms.map((s: { type: string; intensity: number }) => ({
            type: s.type,
            intensity: s.intensity,
          })),
        },
        weather: weatherData ? { upsert: { create: weatherData, update: weatherData } } : undefined,
        pollen: pollenData ? { upsert: { create: pollenData, update: pollenData } } : undefined,
      },
      include: { symptoms: true, weather: true, pollen: true },
    });
    return NextResponse.json(entry);
  }

  const entry = await prisma.entry.create({
    data: {
      date: start,
      recordedBy,
      notes,
      symptoms: {
        create: symptoms.map((s: { type: string; intensity: number }) => ({
          type: s.type,
          intensity: s.intensity,
        })),
      },
      weather: weatherData ? { create: weatherData } : undefined,
      pollen: pollenData ? { create: pollenData } : undefined,
    },
    include: { symptoms: true, weather: true, pollen: true },
  });
  return NextResponse.json(entry, { status: 201 });
}
