import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.journalEntry.findFirst({
    where: { id: params.id, userId: session.user.id }
  });

  if (!existing) {
    return NextResponse.json({ error: "Entry not found." }, { status: 404 });
  }

  const body = await request.json();

  const entry = await prisma.journalEntry.update({
    where: { id: params.id },
    data: {
      title: body?.title !== undefined ? String(body.title).trim() || "Untitled reflection" : existing.title,
      content: body?.content !== undefined ? String(body.content) : existing.content,
      mood: body?.mood ?? existing.mood,
      reflection: body?.reflection === undefined ? existing.reflection : String(body.reflection).trim() || null,
      isPinned: body?.isPinned ?? existing.isPinned,
      isDraft: body?.isDraft ?? existing.isDraft,
      entryDate: body?.entryDate ? new Date(body.entryDate) : existing.entryDate
    }
  });

  return NextResponse.json({ entry });
}

export async function DELETE(_request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.journalEntry.findFirst({
    where: { id: params.id, userId: session.user.id }
  });

  if (!existing) {
    return NextResponse.json({ error: "Entry not found." }, { status: 404 });
  }

  await prisma.journalEntry.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
