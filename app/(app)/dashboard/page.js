import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const [tasks, journalEntries, categories] = await Promise.all([
    prisma.task.findMany({
      where: { userId: session.user.id },
      include: { category: true },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
      take: 6
    }),
    prisma.journalEntry.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isPinned: "desc" }, { entryDate: "desc" }, { updatedAt: "desc" }],
      take: 4
    }).catch(() => []),
    prisma.category.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" }
    })
  ]);

  const streak = Math.max(1, journalEntries.length + Math.min(7, tasks.filter((t) => t.status === "done").length));

  return (
    <div className="space-y-6">
      <section className="glass-card paper-texture paper-shadow rounded-[2.5rem] border border-white/70 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-[#8b5e3c]">Dashboard</p>
            <h1 className="journal-heading mt-3 text-5xl leading-[0.96] text-[#5c4033] sm:text-6xl">
              A quiet, organized home for your day.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#6f5847]">
              A premium overview of tasks, journal pages, and the rhythm of your productivity.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Link href="/tasks" className="rounded-[1.5rem] bg-[#8b5e3c] px-4 py-3 text-sm font-semibold text-[#faf3e0]">Tasks</Link>
            <Link href="/journal" className="rounded-[1.5rem] bg-[#faf3e0] px-4 py-3 text-sm font-semibold text-[#5c4033] ring-1 ring-[#d4a373]/25">Journal</Link>
            <Link href="/calendar" className="rounded-[1.5rem] bg-[#faf3e0] px-4 py-3 text-sm font-semibold text-[#5c4033] ring-1 ring-[#d4a373]/25">Calendar</Link>
            <Link href="/analytics" className="rounded-[1.5rem] bg-[#faf3e0] px-4 py-3 text-sm font-semibold text-[#5c4033] ring-1 ring-[#d4a373]/25">Analytics</Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Tasks due", tasks.filter((task) => task.status !== "done").length],
          ["Completed", tasks.filter((task) => task.status === "done").length],
          ["Journal pages", journalEntries.length],
          ["Streak", streak]
        ].map(([label, value]) => (
          <div key={`dashboard-stat-${String(label)}`} className="rounded-[2rem] border border-[#d4a373]/25 bg-[linear-gradient(180deg,#fffdf8,#f5e6d3)] p-5 shadow-[0_14px_28px_rgba(92,64,51,0.08)]">
            <p className="text-sm text-[#7a624f]">{label}</p>
            <p className="journal-heading mt-2 text-4xl text-[#5c4033]">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2.35rem] border border-[#d4a373]/25 bg-[#fffdf8] p-5 shadow-[0_16px_30px_rgba(92,64,51,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e3c]">Recent tasks</p>
              <h2 className="journal-heading mt-2 text-3xl text-[#5c4033]">What needs your attention</h2>
            </div>
            <Link href="/tasks" className="text-sm font-semibold text-[#8b5e3c]">Open tasks</Link>
          </div>
          <div className="mt-5 space-y-3">
            {tasks.map((task) => (
                <div key={`dashboard-task-${task.id}`} className="rounded-[1.6rem] border border-[#d4a373]/20 bg-[linear-gradient(180deg,#fff,#faf3e0)] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#8b5e3c]">{task.priority}</p>
                    <h3 className="journal-serif mt-1 text-3xl text-[#5c4033]">{task.title}</h3>
                    <p className="mt-2 text-sm text-[#6f5847]">{task.category?.name || "No category"}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#5c4033] ring-1 ring-[#d4a373]/20">
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2.35rem] border border-[#d4a373]/25 bg-[linear-gradient(180deg,#fffdf8,#f4eadc)] p-5 shadow-[0_16px_30px_rgba(92,64,51,0.08)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e3c]">Recent reflections</p>
            <div className="mt-4 space-y-3">
              {journalEntries.length ? journalEntries.map((entry) => (
                <div key={`dashboard-reflection-${entry.id}`} className="rounded-[1.6rem] bg-white/80 p-4 ring-1 ring-[#d4a373]/20">
                  <p className="journal-script text-2xl text-[#8b5e3c]">{entry.mood}</p>
                  <p className="journal-heading mt-1 text-3xl text-[#5c4033]">{entry.title || "Untitled page"}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-[#6f5847]">{entry.content}</p>
                </div>
              )) : (
                <p className="text-sm text-[#6f5847]">No reflections yet. Open the journal to begin.</p>
              )}
            </div>
          </div>

          <div className="rounded-[2.35rem] border border-dashed border-[#d4a373]/30 bg-[#faf3e0]/70 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e3c]">Quick navigation</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link href="/tasks" className="rounded-[1.4rem] bg-white px-4 py-3 ring-1 ring-[#d4a373]/20">Open productivity board</Link>
              <Link href="/journal" className="rounded-[1.4rem] bg-white px-4 py-3 ring-1 ring-[#d4a373]/20">Open scrapbook journal</Link>
              <Link href="/profile" className="rounded-[1.4rem] bg-white px-4 py-3 ring-1 ring-[#d4a373]/20">View profile</Link>
              <Link href="/settings" className="rounded-[1.4rem] bg-white px-4 py-3 ring-1 ring-[#d4a373]/20">Adjust settings</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
