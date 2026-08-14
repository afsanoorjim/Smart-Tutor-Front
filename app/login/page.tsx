"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await api.login(email, password);
      localStorage.setItem("auth_token", token);
      router.push("/dashboard");
    } catch {
      setError("That email and password combination didn't work.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <p className="text-xs tracking-widest uppercase text-ink-soft mb-2">Ledger</p>
        <h1 className="font-display text-3xl italic text-ink mb-8">
          See how class is going.
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-ink-soft mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-paper-line bg-white px-3 py-2 text-ink focus:border-mastery outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-ink-soft mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-paper-line bg-white px-3 py-2 text-ink focus:border-mastery outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-risk" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-ink text-paper py-2 text-sm font-medium hover:bg-mastery transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
