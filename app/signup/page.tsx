"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password needs to be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const { access: token } = await api.signup(name, email, password);
      localStorage.setItem("auth_token", token);
      router.push("/dashboard");
    } catch {
      setError("Couldn't create that account. The email may already be in use.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <p className="text-xs tracking-widest uppercase text-ink-soft mb-2">Ledger</p>
        <h1 className="font-display text-3xl italic text-ink mb-8">
          Set up your account.
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-ink-soft mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-paper-line bg-white px-3 py-2 text-ink focus:border-mastery outline-none"
            />
          </div>
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
          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-ink-soft mb-1">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-ink-soft mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-ink underline hover:text-mastery">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
