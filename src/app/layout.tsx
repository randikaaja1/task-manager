import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Simple Task Manager built with Next.js + Prisma + MySQL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 text-zinc-100">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              {/* Ganti src sesuai file logo kamu */}
              <Image
                src="/logoundiksha.png"
                alt="Logo"
                width={28}
                height={28}
                className="h-7 w-7"
                priority
              />
              <span className="text-sm font-semibold tracking-wide">
                TMP || Task Manager Pribadi
              </span>
            </Link>

            <nav className="flex items-center gap-2">
              <Link
                href="/tasks"
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-200 hover:bg-white/10"
              >
                Tasks
              </Link>
              <a
                href="https://prisma.io"
                target="_blank"
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-200 hover:bg-white/10"
              >
                Prisma
              </a>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>

        <footer className="border-t border-white/10 py-6">
          <div className="mx-auto max-w-5xl px-4 text-xs text-zinc-400">
            Built with Next.js + Prisma + MySQL (Docker)
          </div>
        </footer>
      </body>
    </html>
  );
}
