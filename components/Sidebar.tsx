"use client";

import Link from "next/link";
import { api } from "@/lib/api";

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-paper-line bg-paper px-5 py-8 flex flex-col justify-between">
      <div>
        <Link href="/dashboard" className="block font-display text-xl italic text-ink mb-10">
          Ledger
        </Link>
        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className="block rounded px-3 py-2 text-sm text-ink hover:bg-mastery-soft transition-colors"
          >
            Classes
          </Link>
          <Link
            href="/dashboard"
            className="block rounded px-3 py-2 text-sm text-ink-soft hover:bg-mastery-soft hover:text-ink transition-colors"
          >
            All students
          </Link>
        </nav>
      </div>
      <button
        onClick={() => {
          api.logout();
          window.location.href = "/login";
        }}
        className="text-left text-sm text-ink-soft hover:text-ink transition-colors"
      >
        Sign out
      </button>
    </aside>
  );
}
