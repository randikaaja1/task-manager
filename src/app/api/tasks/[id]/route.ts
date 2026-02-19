import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

function parseId(id: string) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const id = parseId(params.id);
    if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

    const body = await req.json().catch(() => null);

    // tipe data update yang kita izinkan
    const data: {
      title?: string;
      completed?: boolean;
      description?: string | null;
      dueDate?: Date | null;
    } = {};

    // title optional
    if (typeof body?.title === "string") {
      const t = body.title.trim();
      if (t) data.title = t;
    }

    // completed optional
    if (typeof body?.completed === "boolean") {
      data.completed = body.completed;
    }

    // description optional (string / null)
    if (typeof body?.description === "string") {
      data.description = body.description.trim() || null;
    }
    if (body?.description === null) {
      data.description = null;
    }

    // dueDate optional (ISO string / null)
    if (typeof body?.dueDate === "string") {
      const d = new Date(body.dueDate);
      if (Number.isNaN(d.getTime())) {
        return NextResponse.json({ message: "Invalid dueDate" }, { status: 400 });
      }
      data.dueDate = d;
    }
    if (body?.dueDate === null) {
      data.dueDate = null; // hapus deadline
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ message: "No valid fields" }, { status: 400 });
    }

    const updated = await prisma.task.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("PATCH /api/tasks/[id] error:", err);

    // jika id tidak ditemukan
    if (err?.code === "P2025") {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const id = parseId(params.id);
    if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("DELETE /api/tasks/[id] error:", err);

    if (err?.code === "P2025") {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
