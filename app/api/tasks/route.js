import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function parseDueDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    include: { category: true },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }]
  });

  return NextResponse.json({ tasks });
}

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const title = body?.title?.trim();

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  let categoryId = null;
  if (body?.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: body.categoryId, userId: session.user.id }
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    categoryId = category.id;
  }

  const task = await prisma.task.create({
    data: {
      title,
      description: body?.description?.trim() || null,
      priority: body?.priority || "medium",
      status: body?.status || "todo",
      dueDate: parseDueDate(body?.dueDate),
      userId: session.user.id,
      categoryId
    },
    include: { category: true }
  });

  return NextResponse.json({ task }, { status: 201 });
}
