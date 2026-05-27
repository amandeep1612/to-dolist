import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AnalyticsPage() {
  const session = await auth();
  const [tasks, journalEntries] = await Promise.all([
    prisma.task.findMany({ where: { userId: session.user.id } }),
    prisma.journalEntry.findMany({ where: { userId: session.user.id } }).catch(() => [])
  ]);

  const completed = tasks.filter((task) => task.status === "done").length;
  const focus = tasks.filter((task) => task.priority === "high").length;
  const moods = journalEntries.reduce((acc, entry) => ({ ...acc, [entry.mood]: (acc[entry.mood] || 0) + 1 }), {});

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-card paper-texture paper-shadow rounded-[2.5rem] border border-white/70 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[#8b5e3c]">Analytics</p>
          <h1 className="journal-heading mt-3 text-5xl text-[#5c4033]">The rhythm of your work and reflections.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#6f5847]">
            A quiet view into your momentum, moods, and the patterns behind your day.
          </p>
        </div>
        <div className="rounded-[2.5rem] border border-[#d4a373]/25 bg-[linear-gradient(180deg,#fffdf8,#f5e6d3)] p-5 shadow-[0_14px_28px_rgba(92,64,51,0.08)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e3c]">Actions</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full bg-[#8b5e3c] px-4 py-2 text-sm font-semibold text-[#faf3e0]">Dashboard</Link>
            <Link href="/journal" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#5c4033] ring-1 ring-[#d4a373]/20">Journal</Link>
          </div>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total tasks", tasks.length],
          ["Completed", completed],
          ["High focus", focus],
          ["Journal pages", journalEntries.length]
        ].map(([label, value]) => (
          <div key={`analytics-stat-${String(label)}`} className="rounded-[2rem] border border-[#d4a373]/25 bg-[linear-gradient(180deg,#fffdf8,#f5e6d3)] p-5 shadow-[0_14px_28px_rgba(92,64,51,0.08)]">
            <p className="text-sm text-[#7a624f]">{label}</p>
            <p className="journal-heading mt-2 text-4xl text-[#5c4033]">{value}</p>
          </div>
        ))}
      </section>
      <section className="rounded-[2.5rem] border border-[#d4a373]/25 bg-[#fffdf8] p-6 shadow-[0_16px_30px_rgba(92,64,51,0.08)]">
        <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e3c]">Mood notes</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {Object.entries(moods).length ? Object.entries(moods).map(([mood, count]) => (
            <span key={`analytics-mood-${mood}`} className="rounded-full bg-[#faf3e0] px-4 py-2 text-sm ring-1 ring-[#d4a373]/20">
              {mood}: {count}
            </span>
          )) : <p className="text-sm text-[#6f5847]">No journal moods yet.</p>}
        </div>
      </section>
    </div>
  );
}
