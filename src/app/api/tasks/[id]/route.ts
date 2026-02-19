import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// params bisa object atau Promise (biar aman di Next versi baru)
type Ctx = { params: { id: string } | Promise<{ id: string }> };

function parseId(id: string) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

async function getId(ctx: Ctx) {
  const p = await ctx.params; // <-- kunci fix
  return parseId(p.id);
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const id = await getId(ctx);
    if (!id) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const body = await req.json().catch(() => null);

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

    // description optional
    if (typeof body?.description === "string") {
      data.description = body.description.trim() || null;
    } else if (body?.description === null) {
      data.description = null;
    }

    // dueDate optional
    if (typeof body?.dueDate === "string") {
      const d = new Date(body.dueDate);
      if (Number.isNaN(d.getTime())) {
        return NextResponse.json({ message: "Invalid dueDate" }, { status: 400 });
      }
      data.dueDate = d;
    } else if (body?.dueDate === null) {
      data.dueDate = null;
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

    if (err?.code === "P2025") {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_: Request, ctx: Ctx) {
  try {
    const id = await getId(ctx);
    if (!id) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

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
