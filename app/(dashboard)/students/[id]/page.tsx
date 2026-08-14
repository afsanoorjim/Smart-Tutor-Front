"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { StudentDetail } from "@/lib/types";
import { ProgressLedger } from "@/components/ProgressLedger";

export default function StudentPage({ params }: { params: { id: string } }) {
  const [student, setStudent] = useState<StudentDetail | null>(null);

  useEffect(() => {
    api.getStudent(params.id).then(setStudent).catch(() => setStudent(null));
  }, [params.id]);

  if (!student) {
    return <p className="text-sm text-ink-soft">Loading…</p>;
  }

  return (
    <div className="max-w-2xl">
      <p className="text-xs tracking-widest uppercase text-ink-soft mb-1">{student.className}</p>
      <h1 className="font-display text-3xl italic text-ink mb-1">{student.name}</h1>
      <p className="text-sm text-ink-soft mb-6">
        Last active {new Date(student.lastActive).toLocaleDateString()}
      </p>

      <div className="rounded border border-paper-line bg-white px-5 py-4 mb-8">
        <p className="text-xs text-ink-soft mb-2">Overall mastery</p>
        <ProgressLedger percent={student.masteryPercent} status={student.status} />
        <p className="text-xs text-ink-soft mt-2">
          {student.topicsMastered} of {student.topicsTotal} topics mastered
        </p>
      </div>

      <h2 className="text-sm font-medium text-ink mb-3">By topic</h2>
      <div className="rounded border border-paper-line bg-white divide-y divide-paper-line">
        {student.topics.map((t) => (
          <div key={t.name} className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-ink">{t.name}</span>
            <ProgressLedger
              percent={t.mastery}
              status={t.mastery >= 70 ? "on-track" : t.mastery >= 40 ? "attention" : "at-risk"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
