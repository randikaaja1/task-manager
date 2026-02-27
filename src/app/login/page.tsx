"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/tasks",
    });

    // kalau redirect true, biasanya tidak sampai sini
    if (res?.error) setErr("Email atau password salah");
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <h1 className="text-xl font-semibold">Login</h1>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-2 text-sm"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-2 text-sm"
          placeholder="Password"
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
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-300">
        Belum punya akun?{" "}
        <a className="text-white underline" href="/register">
          Register
        </a>
      </p>
    </div>
  );
}