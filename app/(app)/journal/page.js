import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import JournalDashboard from "@/components/journal-dashboard";
import Link from "next/link";

export default async function JournalPage() {
  const session = await auth();
  const journalEntries = await prisma.journalEntry.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isPinned: "desc" }, { entryDate: "desc" }, { updatedAt: "desc" }]
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="glass-card paper-texture paper-shadow min-w-0 rounded-[2.5rem] border border-white/70 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[#8b5e3c]">Journal Sanctuary</p>
          <h1 className="journal-heading mt-3 text-4xl leading-[1.05] text-[#5c4033] sm:text-5xl">
            A scrapbook for your quietest thoughts.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#6f5847] sm:text-lg sm:leading-8">
            Write, pin, collect memories, and keep track of how the day felt without losing the cozy handmade character.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full bg-[#8b5e3c] px-5 py-3 text-sm font-semibold text-[#faf3e0]">
              Back to desk
            </Link>
            <Link href="/tasks" className="rounded-full bg-[#faf3e0] px-5 py-3 text-sm font-semibold text-[#5c4033] ring-1 ring-[#d4a373]/25">
              Productivity board
            </Link>
          </div>
        </div>

        <div className="min-w-0 rounded-[2.5rem] border border-[#d4a373]/25 bg-[linear-gradient(180deg,#fffdf8,#f5e6d3)] p-5 shadow-[0_14px_28px_rgba(92,64,51,0.08)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e3c]">Memory pages</p>
          <div className="mt-4 space-y-3">
            {journalEntries.slice(0, 3).map((entry) => (
              <div key={entry.id} className="rounded-[1.6rem] bg-white/80 p-4 ring-1 ring-[#d4a373]/20">
                <p className="journal-script text-2xl text-[#8b5e3c]">{entry.mood}</p>
                <p className="journal-heading mt-1 text-2xl leading-tight text-[#5c4033] sm:text-3xl">
                  {entry.title || "Untitled page"}
                </p>
                <p className="mt-2 break-words text-sm leading-6 text-[#6f5847]">{entry.content}</p>
              </div>
            ))}
            {!journalEntries.length ? (
              <p className="text-sm text-[#6f5847]">No entries yet. The page is ready when you are.</p>
            ) : null}
          </div>
        </div>
      </section>

      <JournalDashboard initialEntries={journalEntries} />
    </div>
  );
}
