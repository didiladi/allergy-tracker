import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchPollen } from "@/lib/pollen";

export async function GET() {
  const config = await prisma.config.findUnique({ where: { id: "default" } });
  const lat = config?.lat ?? 48.2092;
  const lon = config?.lon ?? 16.3728;
  try {
    const pollen = await fetchPollen(lat, lon);
    return NextResponse.json({ ...pollen, lat, lon });
  } catch {
    return NextResponse.json({ error: "Pollendaten nicht verfügbar" }, { status: 503 });
  }
}
