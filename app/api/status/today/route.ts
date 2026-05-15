import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const entry = await prisma.entry.findFirst({
    where: { date: { gte: today, lt: tomorrow } },
  });

  return NextResponse.json({
    recorded: entry !== null,
    date: today.toISOString().slice(0, 10),
    entryId: entry?.id ?? null,
  });
}
