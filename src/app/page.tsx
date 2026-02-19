import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_55%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.18),transparent_50%)]" />

      <h1 className="text-3xl font-semibold tracking-tight">
        Task Manager yang ringan, rapi, dan siap kerja.
      </h1>
      <p className="mt-3 max-w-2xl text-zinc-300">
        Frontend Next.js (App Router) + Prisma + MySQL (Docker). Fokus: CRUD task,
        UI clean, dan struktur project profesional.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/tasks"
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:opacity-90"
        >
          Buka Tasks
        </Link>
        <a
          href="http://localhost:49152"
          className="rounded-xl border border-white/15 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
        >
          Prisma Studio
        </a>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {[
          { title: "App Router", desc: "Routing & layout bawaan Next.js." },
          { title: "Prisma ORM", desc: "Query MySQL lebih aman dan rapi." },
          { title: "MySQL Docker", desc: "Database lokal yang konsisten." },
        ].map((c) => (
          <div
            key={c.title}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="text-sm font-semibold">{c.title}</div>
            <div className="mt-1 text-sm text-zinc-300">{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
