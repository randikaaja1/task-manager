import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").toLowerCase().trim();
    const password = String(body?.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ message: "Email dan password wajib diisi" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password minimal 6 karakter" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        passwordHash,
      },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error("POST /api/auth/register error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}