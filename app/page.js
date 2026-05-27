import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fff9f7_0%,#f8eee4_100%)] text-[#5c4033]">
      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(214,186,171,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(214,186,171,0.18)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(255,255,255,0.95),transparent_18%),radial-gradient(circle_at_86%_14%,rgba(255,255,255,0.82),transparent_12%),radial-gradient(circle_at_11%_76%,rgba(255,255,255,0.9),transparent_16%),radial-gradient(circle_at_90%_80%,rgba(255,255,255,0.72),transparent_14%)]" />
      <div className="pointer-events-none absolute left-[-7%] top-[18%] h-44 w-44 rounded-full bg-white/80 blur-2xl" />
      <div className="pointer-events-none absolute right-[-6%] bottom-[12%] h-56 w-56 rounded-full bg-white/70 blur-3xl" />

      <section className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative w-full overflow-hidden rounded-[3rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(255,249,246,0.82))] p-4 shadow-[0_24px_80px_rgba(92,64,51,0.12)] sm:p-5">
          <div className="relative overflow-hidden rounded-[2.4rem] border border-[#ead8cb] bg-[linear-gradient(180deg,rgba(245,229,217,0.92),rgba(252,247,242,0.96))] p-8 sm:p-10">
            <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:34px_34px]" />
            <div className="absolute left-0 top-0 h-20 w-20 rounded-br-[2.5rem] bg-white/80" />
            <div className="absolute right-0 top-0 h-14 w-14 rounded-bl-[2rem] bg-white/70" />
            <div className="absolute left-0 bottom-0 h-24 w-24 rounded-tr-[2.5rem] bg-white/75" />
            <div className="absolute right-0 bottom-0 h-20 w-20 rounded-tl-[2.5rem] bg-white/75" />

            <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
              <span className="inline-flex rounded-full border border-[#e8d2c0] bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b57a63] shadow-[0_8px_20px_rgba(92,64,51,0.06)]">
                Velora
              </span>

              <div className="mt-8 rounded-[2rem] border border-[#d9c2b2] bg-[linear-gradient(180deg,#f1ddd0,#e7d0c1)] px-8 py-5 shadow-[0_14px_28px_rgba(92,64,51,0.08)]">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/90">Login</p>
              </div>

              <p className="mt-6 max-w-xl text-sm leading-7 text-[#7a624f] sm:text-base">
                A soft, scrapbook-inspired home for planning and journaling.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/login"
                  className="rounded-full bg-[#8b5e3c] px-6 py-3 text-sm font-semibold text-[#faf3e0] shadow-lg shadow-[#8b5e3c]/20 transition hover:-translate-y-0.5"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#5c4033] ring-1 ring-[#d9c2b2] transition hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>

              <div className="mt-10 grid w-full gap-3 sm:grid-cols-2">
                <div className="rounded-[1.7rem] border border-[#e7d4c8] bg-white/75 p-4 text-left shadow-[0_12px_28px_rgba(92,64,51,0.06)]">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#b57a63]">Soft planner</p>
                  <p className="mt-2 text-sm leading-6 text-[#7a624f]">A cozy, cute space for tasks and daily rhythm.</p>
                </div>
                <div className="rounded-[1.7rem] border border-[#e7d4c8] bg-white/75 p-4 text-left shadow-[0_12px_28px_rgba(92,64,51,0.06)]">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#b57a63]">Journal nook</p>
                  <p className="mt-2 text-sm leading-6 text-[#7a624f]">Vintage pages, moods, memories, and reflection.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
