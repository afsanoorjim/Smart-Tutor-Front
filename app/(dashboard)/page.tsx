"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Student } from "@/lib/types";
import { ProgressLedger } from "@/components/ProgressLedger";

export default function DashboardPage() {
  const [students, setStudents] = useState<Student[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .getStudents()
      .then(setStudents)
      .catch(() => setError(true));
  }, []);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <p className="text-xs tracking-widest uppercase text-ink-soft mb-1">Today</p>
          <h1 className="font-display text-3xl italic text-ink">Your students</h1>
        </div>
      </div>

      {error && (
        <div className="rounded border border-attention-soft bg-attention-soft px-4 py-3 text-sm text-ink mb-6">
          Couldn't reach the backend yet. Set <code className="font-mono">NEXT_PUBLIC_API_URL</code> in
          <code className="font-mono"> .env.local</code> to your Django API once it's deployed.
        </div>
      )}

      {!error && students === null && (
        <p className="text-sm text-ink-soft">Loading…</p>
      )}

      {students && students.length === 0 && (
        <p className="text-sm text-ink-soft">No students yet.</p>
      )}

      {students && students.length > 0 && (
        <div className="ledger-bg rounded border border-paper-line divide-y divide-paper-line bg-white">
          {students.map((s) => (
            <Link
              key={s.id}
              href={`/students/${s.id}`}
              className="flex items-center justify-between px-5 py-3 hover:bg-mastery-soft/40 transition-colors"
            >
              <div>
                <p className="text-ink font-medium">{s.name}</p>
                <p className="text-xs text-ink-soft">{s.className}</p>
              </div>
              <ProgressLedger percent={s.masteryPercent} status={s.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
