import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let config = await prisma.config.findUnique({ where: { id: "default" } });
  if (!config) {
    config = await prisma.config.create({ data: { id: "default" } });
  }
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { lat, lon, city, user1, user2 } = body;
  const config = await prisma.config.upsert({
    where: { id: "default" },
    update: { lat, lon, city, user1, user2 },
    create: { id: "default", lat, lon, city, user1, user2 },
  });
  return NextResponse.json(config);
}
