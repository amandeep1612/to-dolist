import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function parseDueDate(value) {
  if (value === undefined) return undefined;
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existingTask = await prisma.task.findFirst({
    where: { id: params.id, userId: session.user.id }
  });

  if (!existingTask) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  const body = await request.json();

  if (body?.title !== undefined && !body.title.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  let categoryId;
  if (body?.categoryId !== undefined) {
    if (body.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: body.categoryId, userId: session.user.id }
      });

      if (!category) {
        return NextResponse.json({ error: "Category not found." }, { status: 404 });
      }

      categoryId = category.id;
    } else {
      categoryId = null;
    }
  }

  const task = await prisma.task.update({
    where: { id: params.id },
    data: {
      title: body?.title !== undefined ? body.title.trim() : existingTask.title,
      description: body?.description === undefined ? existingTask.description : body?.description?.trim() || null,
      priority: body?.priority ?? existingTask.priority,
      status: body?.status ?? existingTask.status,
      categoryId: body?.categoryId === undefined ? existingTask.categoryId : categoryId,
      dueDate: body?.dueDate === undefined ? existingTask.dueDate : parseDueDate(body?.dueDate),
      completedAt:
        body?.status === "done"
          ? existingTask.completedAt ?? new Date()
          : body?.status === "todo" && existingTask.status === "done"
            ? null
            : existingTask.completedAt
    },
    include: { category: true }
  });

  return NextResponse.json({ task });
}

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existingTask = await prisma.task.findFirst({
    where: { id: params.id, userId: session.user.id }
  });

  if (!existingTask) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  await prisma.task.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
