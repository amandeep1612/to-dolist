import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CalendarPage() {
  const session = await auth();
  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id, dueDate: { not: null } },
    include: { category: true },
    orderBy: { dueDate: "asc" }
  });

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card paper-texture paper-shadow rounded-[2.5rem] border border-white/70 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[#8b5e3c]">Calendar</p>
          <h1 className="journal-heading mt-3 text-5xl text-[#5c4033]">A calm schedule, laid out like pages in a diary.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#6f5847]">
            See deadlines, upcoming pages, and time-bound commitments in a warm paper-style flow.
          </p>
        </div>
        <div className="rounded-[2.5rem] border border-[#d4a373]/25 bg-[linear-gradient(180deg,#fffdf8,#f5e6d3)] p-5 shadow-[0_14px_28px_rgba(92,64,51,0.08)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e3c]">This week</p>
          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs">
            {["S","M","T","W","T","F","S"].map((d, index) => <span key={`calendar-day-${d}-${index}`} className="text-[#7a624f]">{d}</span>)}
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={`calendar-cell-${i}`} className="rounded-full bg-white/80 px-2 py-2 ring-1 ring-[#d4a373]/20">
                {i + 1}
              </span>
            ))}
          </div>
          <Link href="/tasks" className="mt-4 inline-flex rounded-full bg-[#8b5e3c] px-4 py-2 text-sm font-semibold text-[#faf3e0]">
            Review tasks
          </Link>
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {tasks.map((task) => (
          <div key={`calendar-task-${task.id}`} className="rounded-[2rem] border border-[#d4a373]/25 bg-[linear-gradient(180deg,#fffdf8,#f5e6d3)] p-5 shadow-[0_14px_28px_rgba(92,64,51,0.08)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e3c]">{task.category?.name || "No category"}</p>
            <h2 className="journal-heading mt-2 text-3xl text-[#5c4033]">{task.title}</h2>
            <p className="mt-2 text-sm text-[#6f5847]">{new Date(task.dueDate).toLocaleString()}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
