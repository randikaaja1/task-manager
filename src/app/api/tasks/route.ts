import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
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
    const body = await req.json().catch(() => null);

    const title = String(body?.title ?? "").trim();
    const descriptionRaw = body?.description;
    const description =
      typeof descriptionRaw === "string" && descriptionRaw.trim() !== ""
        ? descriptionRaw.trim()
        : null;

    // dueDate: terima ISO string dari frontend
    const dueDateRaw = body?.dueDate;
    let dueDate: Date | null = null;

    if (typeof dueDateRaw === "string" && dueDateRaw.trim() !== "") {
      const d = new Date(dueDateRaw);
      if (Number.isNaN(d.getTime())) {
        return NextResponse.json({ message: "Invalid dueDate" }, { status: 400 });
      }
      dueDate = d;
    }

    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: { title, description, dueDate },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
