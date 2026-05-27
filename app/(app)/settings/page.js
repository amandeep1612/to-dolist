import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card paper-texture paper-shadow rounded-[2.5rem] border border-white/70 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[#8b5e3c]">Settings</p>
          <h1 className="journal-heading mt-3 text-5xl text-[#5c4033]">Quiet controls for your workspace.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#6f5847]">
            Tune the atmosphere, the writing flow, and the little rituals that make Velora feel personal.
          </p>
        </div>
        <div className="rounded-[2.5rem] border border-[#d4a373]/25 bg-[linear-gradient(180deg,#fffdf8,#f5e6d3)] p-5 shadow-[0_14px_28px_rgba(92,64,51,0.08)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e3c]">Navigation</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full bg-[#8b5e3c] px-4 py-2 text-sm font-semibold text-[#faf3e0]">Dashboard</Link>
            <Link href="/tasks" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#5c4033] ring-1 ring-[#d4a373]/20">Tasks</Link>
          </div>
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        {["Theme", "Notifications", "Privacy", "Writing mode"].map((item) => (
          <div key={`settings-${String(item)}`} className="rounded-[2rem] border border-[#d4a373]/25 bg-[linear-gradient(180deg,#fffdf8,#f5e6d3)] p-5 shadow-[0_14px_28px_rgba(92,64,51,0.08)]">
            <p className="journal-heading text-3xl text-[#5c4033]">{item}</p>
            <p className="mt-2 text-sm text-[#6f5847]">Settings controls can live here as you expand the product.</p>
          </div>
        ))}
      </section>
    </div>
  );
}
