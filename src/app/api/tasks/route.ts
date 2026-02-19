import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const title = String(body?.title ?? "").trim();
  if (!title) {
    return NextResponse.json({ message: "Title is required" }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: { title },
  });

  return NextResponse.json(task, { status: 201 });
}
