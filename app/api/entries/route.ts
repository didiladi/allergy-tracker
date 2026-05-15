import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchWeather } from "@/lib/weather";
import { fetchPollen } from "@/lib/pollen";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
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
    orderBy: { date: "desc" },
  });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { recordedBy, symptoms, notes, weather, pollen } = body;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existing = await prisma.entry.findFirst({
    where: { date: { gte: today, lt: tomorrow } },
    include: { symptoms: true },
  });

  const config = await prisma.config.findUnique({ where: { id: "default" } });
  const lat = config?.lat ?? 48.2092;
  const lon = config?.lon ?? 16.3728;

  let weatherData = weather;
  let pollenData = pollen;

  if (!weatherData) {
    try { weatherData = { ...await fetchWeather(lat, lon), lat, lon }; } catch {}
  }
  if (!pollenData) {
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
        weather: weatherData
          ? {
              upsert: {
                create: weatherData,
                update: weatherData,
              },
            }
          : undefined,
        pollen: pollenData
          ? {
              upsert: {
                create: pollenData,
                update: pollenData,
              },
            }
          : undefined,
      },
      include: { symptoms: true, weather: true, pollen: true },
    });
    return NextResponse.json(entry);
  }

  const entry = await prisma.entry.create({
    data: {
      date: today,
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
