import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

async function getCurrentUserId() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) return null;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return user?.id ?? null;
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);

    const title = String(body?.title ?? "").trim();
    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    const descriptionRaw = body?.description;
    const description =
      typeof descriptionRaw === "string" && descriptionRaw.trim() !== ""
        ? descriptionRaw.trim()
        : null;

    const dueDateRaw = body?.dueDate;
    let dueDate: Date | null = null;

    if (typeof dueDateRaw === "string" && dueDateRaw.trim() !== "") {
      const d = new Date(dueDateRaw);
      if (Number.isNaN(d.getTime())) {
        return NextResponse.json({ message: "Invalid dueDate" }, { status: 400 });
      }
      dueDate = d;
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate,
        userId,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}