"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const msg = await res.json().catch(() => ({}));
      setErr(msg?.message ?? "Gagal register");
      setLoading(false);
      return;
    }

    // auto login setelah register
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/tasks",
    });

    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <h1 className="text-xl font-semibold">Register</h1>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-2 text-sm"
          placeholder="Nama (opsional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-2 text-sm"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-2 text-sm"
          placeholder="Password (min 6)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {err && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            {err}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-60"
        >
          {loading ? "Loading..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-300">
        Sudah punya akun?{" "}
        <a className="text-white underline" href="/login">
          Login
        </a>
      </p>
    </div>
  );
}