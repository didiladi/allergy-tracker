import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  // Local date string (respects TZ env var, e.g. Europe/Vienna)
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  // Boundaries use setHours so they match entries stored at local midnight
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const entry = await prisma.entry.findFirst({
    where: { date: { gte: start, lt: end } },
  });

  return NextResponse.json({
    recorded: entry !== null,
    date: todayStr,
    entryId: entry?.id ?? null,
  });
}
