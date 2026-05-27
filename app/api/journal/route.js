import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await prisma.journalEntry.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isPinned: "desc" }, { entryDate: "desc" }, { updatedAt: "desc" }]
  });

  return NextResponse.json({ entries });
}

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const title = String(body?.title ?? "").trim();
  const content = String(body?.content ?? "").trim();
  const mood = String(body?.mood ?? "calm").trim();
  const reflection = String(body?.reflection ?? "").trim();

  const entry = await prisma.journalEntry.create({
    data: {
      title: title || "Untitled reflection",
      content,
      mood,
      reflection: reflection || null,
      isPinned: Boolean(body?.isPinned),
      isDraft: Boolean(body?.isDraft),
      userId: session.user.id,
      entryDate: body?.entryDate ? new Date(body.entryDate) : new Date()
    }
  });

  return NextResponse.json({ entry }, { status: 201 });
}
