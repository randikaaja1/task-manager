import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getIdFromUrl(req: Request) {
  const pathname = new URL(req.url).pathname; // contoh: /api/tasks/1
  const idStr = pathname.split("/").pop();    // ambil "1"
  const id = Number(idStr);
  return Number.isFinite(id) ? id : null;
}

export async function PATCH(req: Request) {
  const id = getIdFromUrl(req);
  if (id === null) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));

  const data: { title?: string; completed?: boolean } = {};
  if (typeof body.title === "string") data.title = body.title.trim();
  if (typeof body.completed === "boolean") data.completed = body.completed;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ message: "No valid fields" }, { status: 400 });
  }

  const updated = await prisma.task.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const id = getIdFromUrl(req);
  if (id === null) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
