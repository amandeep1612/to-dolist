import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card paper-texture paper-shadow rounded-[2.5rem] border border-white/70 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[#8b5e3c]">Profile</p>
          <h1 className="journal-heading mt-3 text-5xl text-[#5c4033]">Your reading-light profile page.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#6f5847]">
            Keep your workspace identity, preferences, and writing habits close at hand.
          </p>
        </div>
        <div className="rounded-[2.5rem] border border-[#d4a373]/25 bg-[linear-gradient(180deg,#fffdf8,#f5e6d3)] p-5 shadow-[0_14px_28px_rgba(92,64,51,0.08)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e3c]">Shortcuts</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/settings" className="rounded-full bg-[#8b5e3c] px-4 py-2 text-sm font-semibold text-[#faf3e0]">Settings</Link>
            <Link href="/journal" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#5c4033] ring-1 ring-[#d4a373]/20">Journal</Link>
          </div>
        </div>
      </section>
      <section className="rounded-[2.5rem] border border-[#d4a373]/25 bg-[#fffdf8] p-6 shadow-[0_16px_30px_rgba(92,64,51,0.08)]">
        <p className="text-sm text-[#7a624f]">Name</p>
        <p className="journal-heading mt-1 text-4xl text-[#5c4033]">{session.user.name || "Velora Reader"}</p>
        <p className="mt-4 text-sm text-[#7a624f]">Email</p>
        <p className="mt-1 text-lg text-[#5c4033]">{session.user.email}</p>
      </section>
    </div>
  );
}
