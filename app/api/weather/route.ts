import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchWeather } from "@/lib/weather";

export async function GET() {
  const config = await prisma.config.findUnique({ where: { id: "default" } });
  const lat = config?.lat ?? 48.2092;
  const lon = config?.lon ?? 16.3728;
  try {
    const weather = await fetchWeather(lat, lon);
    return NextResponse.json({ ...weather, lat, lon });
  } catch {
    return NextResponse.json({ error: "Wetterdaten nicht verfügbar" }, { status: 503 });
  }
}
