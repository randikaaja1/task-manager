"use client";

import React, { useEffect, useMemo, useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string | null;
  dueDate: string | null; // ✅ NEW
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(""); // ✅ NEW (datetime-local string)
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completedCount = useMemo(
    () => tasks.filter((t) => t.completed).length,
    [tasks]
  );

  function formatDueDate(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(); // tampilkan sesuai locale user
  }

  async function loadTasks() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat tasks");
      const data = (await res.json()) as Task[];
      setTasks(data);
    } catch (e: any) {
      setError(e?.message ?? "Terjadi error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();

    const cleanTitle = title.trim();
    const cleanDesc = description.trim();
    const cleanDue = dueDate.trim(); // "YYYY-MM-DDTHH:mm"

    if (!cleanTitle) return;

    // convert datetime-local -> ISO string (UTC)
    const dueDateIso = cleanDue ? new Date(cleanDue).toISOString() : null;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle,
          description: cleanDesc ? cleanDesc : null,
          dueDate: dueDateIso, // ✅ kirim ISO / null
        }),
      });

      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg?.message ?? "Gagal menambah task");
      }

      const created = (await res.json()) as Task;
      setTasks((prev) => [created, ...prev]);

      // reset input
      setTitle("");
      setDescription("");
      setDueDate("");
    } catch (e: any) {
      setError(e?.message ?? "Terjadi error");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleTask(task: Task) {
    setError(null);

    // optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
    );

    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });

    if (!res.ok) {
      // rollback
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
      setError("Gagal update status task");
    }
  }

  async function deleteTask(id: number) {
    setError(null);
    const prev = tasks;

    // optimistic
    setTasks((p) => p.filter((t) => t.id !== id));

    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setTasks(prev); // rollback
      setError("Gagal menghapus task");
    }
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Tasks</h2>
            <p className="mt-1 text-sm text-zinc-300">
              {completedCount}/{tasks.length} selesai
            </p>
          </div>

          <button
            onClick={() => void loadTasks()}
            className="mt-3 rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10 sm:mt-0"
          >
            Refresh
          </button>
        </div>

        <form onSubmit={addTask} className="mt-5 flex flex-col gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tulis task baru…"
            className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-white/20"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi (opsional)…"
            className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-white/20"
            rows={3}
          />

          {/* ✅ NEW: target waktu (tanggal + jam) */}
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-white/20"
          />

          <div className="flex items-center justify-end">
            <button
              disabled={submitting}
              className="rounded-xl bg-white px-6 py-2 text-sm font-semibold text-zinc-950 hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Adding..." : "Add"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-2">
        {loading ? (
          <div className="px-4 py-10 text-center text-sm text-zinc-400">
            Loading...
          </div>
        ) : tasks.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-zinc-400">
            Belum ada task. Tambahkan task pertama kamu ✨
          </div>
        ) : (
          tasks.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 hover:bg-white/[0.04]"
            >
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => void toggleTask(t)}
                  className="mt-1 h-4 w-4"
                />

                <div>
                  <span
                    className={`text-sm ${
                      t.completed ? "line-through text-zinc-400" : ""
                    }`}
                  >
                    {t.title}
                  </span>

                  {t.description && (
                    <p className="mt-1 text-xs text-zinc-400">{t.description}</p>
                  )}

                  {/* ✅ NEW: tampilkan deadline */}
                  {t.dueDate && (
                    <p className="mt-1 text-xs text-zinc-500">
                      Target: {formatDueDate(t.dueDate)}
                    </p>
                  )}
                </div>
              </label>

              <button
                onClick={() => void deleteTask(t.id)}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-200 hover:bg-white/10"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
