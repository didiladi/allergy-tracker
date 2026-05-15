import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await prisma.entry.findUnique({
    where: { id },
    include: { symptoms: true, weather: true, pollen: true },
  });
  if (!entry) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  return NextResponse.json(entry);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { recordedBy, symptoms, notes, date: dateStr } = body;

  await prisma.symptom.deleteMany({ where: { entryId: id } });

  const updateData: Parameters<typeof prisma.entry.update>[0]["data"] = {
    recordedBy,
    notes,
    symptoms: {
      create: symptoms.map((s: { type: string; intensity: number }) => ({
        type: s.type,
        intensity: s.intensity,
      })),
    },
  };

  if (dateStr) {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    updateData.date = d;
  }

  const entry = await prisma.entry.update({
    where: { id },
    data: updateData,
    include: { symptoms: true, weather: true, pollen: true },
  });
  return NextResponse.json(entry);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.entry.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
