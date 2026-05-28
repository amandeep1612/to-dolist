import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import TaskManager from "@/components/task-manager";

function PlannerRibbon() {
  return (
    <div className="pointer-events-none absolute right-6 top-6 h-16 w-24 rotate-12">
      <div className="absolute left-0 top-4 h-4 w-20 rounded-full bg-[#fb6f92] shadow-[0_8px_18px_rgba(251,111,146,0.25)]" />
      <div className="absolute left-4 top-0 h-4 w-4 rounded-full bg-[#fb6f92]" />
      <div className="absolute right-0 top-0 h-4 w-4 rounded-full bg-[#fb6f92]" />
    </div>
  );
}

function PlannerHeart({ className = "" }) {
  return <span className={`pointer-events-none absolute text-3xl text-[#fb6f92]/90 ${className}`}>♥</span>;
}

export default async function TasksPage() {
  const session = await auth();
  const [tasks, categories, journalEntries] = await Promise.all([
    prisma.task.findMany({
      where: { userId: session.user.id },
      include: { category: true },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }]
    }),
    prisma.category.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" }
    }),
    prisma.journalEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 1
    }).catch(() => [])
  ]);

  const today = new Date();
  const dateLabel = today.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const active = tasks.filter((task) => task.status !== "done");
  const done = tasks.filter((task) => task.status === "done");
  const topPriorities = tasks.filter((task) => task.priority === "high").slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[3rem] border border-white/80 bg-[linear-gradient(180deg,#fff7f9_0%,#fff0f3_46%,#ffe5ec_100%)] p-4 shadow-[0_24px_70px_rgba(92,64,51,0.12)]">
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(90deg,rgba(251,111,146,0.09)_1px,transparent_1px),linear-gradient(rgba(251,111,146,0.09)_1px,transparent_1px)] [background-size:26px_26px]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,rgba(255,181,199,0.22))]" />
        <PlannerHeart className="left-4 top-6" />
        <PlannerHeart className="right-8 bottom-14 text-4xl" />
        <PlannerRibbon />

        <div className="relative overflow-hidden rounded-[2.6rem] border border-[#fb6f92]/22 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,240,243,0.9))] p-4 sm:p-6 lg:p-7">
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-[#c45d79] ring-1 ring-[#fb6f92]/20">
              {dateLabel}
            </div>
            <div className="rounded-full bg-[#fff0f3] px-4 py-2 text-sm font-semibold text-[#c45d79] ring-1 ring-[#fb6f92]/18">
              {active.length} active tasks
            </div>
            <div className="rounded-full bg-[#fff0f3] px-4 py-2 text-sm font-semibold text-[#c45d79] ring-1 ring-[#fb6f92]/18">
              {done.length} completed
            </div>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_0.72fr]">
            <div className="grid gap-3">
              <div className="rounded-[2rem] border border-[#fb6f92]/22 bg-white/85 p-4 shadow-[0_14px_28px_rgba(92,64,51,0.08)] soft-panel-hover">
                <p className="text-xs uppercase tracking-[0.24em] text-[#c45d79]">Goals</p>
                <div className="mt-3 min-h-28 rounded-[1.6rem] border border-dashed border-[#fb6f92]/25 bg-[linear-gradient(180deg,#fff7f9,#fff0f3)] p-4 text-sm leading-7 text-[#7a624f]">
                  Set one gentle goal, one brave goal, and one thing you’re proud to finish today.
                </div>
              </div>

              <div className="rounded-[2rem] border border-[#fb6f92]/22 bg-white/85 p-4 shadow-[0_14px_28px_rgba(92,64,51,0.08)] soft-panel-hover">
                <p className="text-xs uppercase tracking-[0.24em] text-[#c45d79]">Top priorities</p>
                <div className="mt-3 space-y-2">
                  {topPriorities.length ? topPriorities.map((task, index) => (
                    <div key={`priority-${task.id}`} className="rounded-[1.2rem] bg-[#fff0f3] px-3 py-2 text-sm text-[#5c4033] ring-1 ring-[#fb6f92]/15">
                      <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#fb6f92] text-[11px] font-bold text-white">
                        {index + 1}
                      </span>
                      {task.title}
                    </div>
                  )) : (
                    <p className="rounded-[1.2rem] bg-[#fff0f3] px-3 py-3 text-sm text-[#7a624f] ring-1 ring-[#fb6f92]/15">
                      Add a high priority task to see it here.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[2.35rem] border border-[#fb6f92]/22 bg-[linear-gradient(180deg,#fff,#fff0f3)] p-5 shadow-[0_16px_30px_rgba(92,64,51,0.08)] soft-panel-hover">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#c45d79]">To Do</p>
                  <span className="journal-script text-3xl text-[#fb6f92]">♡</span>
                </div>
                <div className="mt-4 space-y-3">
                  {tasks.slice(0, 8).map((task) => (
                    <div key={`planner-task-${task.id}`} className="flex items-start gap-3 rounded-[1.2rem] border border-[#fb6f92]/15 bg-white/85 px-4 py-3">
                      <span className="mt-1 inline-flex h-5 w-5 shrink-0 rounded-full border-2 border-[#fb6f92]" />
                      <div className="min-w-0">
                        <p className={`text-sm font-medium ${task.status === "done" ? "line-through text-[#9f7d86]" : "text-[#5c4033]"}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-[#7a624f]">
                          {task.category?.name || "No category"} · {task.priority}
                        </p>
                      </div>
                    </div>
                  ))}
                  {!tasks.length ? (
                    <p className="rounded-[1.2rem] bg-white/85 px-4 py-4 text-sm text-[#7a624f] ring-1 ring-[#fb6f92]/15">
                      No tasks yet. Use the planner form below to add your first item.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[2.35rem] border border-[#fb6f92]/22 bg-[linear-gradient(180deg,#fff,#fff0f3)] p-5 shadow-[0_16px_30px_rgba(92,64,51,0.08)] soft-panel-hover">
                <p className="text-xs uppercase tracking-[0.24em] text-[#c45d79]">Notes</p>
                <div className="mt-4 min-h-44 rounded-[1.6rem] border border-dashed border-[#fb6f92]/25 bg-[linear-gradient(180deg,#fff7f9,#fff0f3)] p-4 text-sm leading-7 text-[#7a624f]">
                  Jot reminders, tiny wins, and little thoughts here. The full task editor below keeps the data synced to Neon.
                </div>
              </div>

              <div className="rounded-[2.35rem] border border-[#fb6f92]/22 bg-[linear-gradient(180deg,#fff,#fff0f3)] p-5 shadow-[0_16px_30px_rgba(92,64,51,0.08)] soft-panel-hover">
                <p className="text-xs uppercase tracking-[0.24em] text-[#c45d79]">Goals tracker</p>
                <p className="journal-heading mt-3 text-2xl leading-tight text-[#5c4033] sm:text-3xl">Stay gentle. Stay consistent.</p>
                <p className="mt-2 text-sm leading-6 text-[#7a624f]">
                  {journalEntries.length ? `Recent journal pages: ${journalEntries.length}` : "You can pair this planner with journal pages any time."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TaskManager initialTasks={tasks} categories={categories} />
    </div>
  );
}
