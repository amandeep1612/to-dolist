"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,183,197,0.28),transparent_30%),linear-gradient(180deg,#fff7f9_0%,#fff0f3_48%,#f5e6d3_100%)] px-4 py-8 text-[#5c4033] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 paper-grid opacity-20" />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-6">
          <span className="inline-flex rounded-full border border-[#fb6f92]/20 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c45d79] shadow-[0_12px_28px_rgba(92,64,51,0.08)]">
            Welcome back
          </span>
          <h1 className="journal-heading max-w-xl text-5xl leading-[0.95] sm:text-6xl">
            Login to your soft pink productivity sanctuary.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-[#7a624f]">
            Pick up where you left off. Your tasks, notes, and journal pages stay ready whenever you return.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-[0_18px_40px_rgba(92,64,51,0.08)]">
              <p className="text-xs uppercase tracking-[0.24em] text-[#c45d79]">Get started</p>
              <p className="journal-heading mt-2 text-2xl">Join Velora today</p>
              <Link href="/register" className="mt-4 inline-flex rounded-full bg-[#fb6f92] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#fb6f92]/25 transition hover:-translate-y-0.5">
                Sign Up
              </Link>
            </div>
            <div className="rounded-[2rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,240,243,0.82))] p-5 shadow-[0_18px_40px_rgba(92,64,51,0.08)]">
              <p className="text-xs uppercase tracking-[0.24em] text-[#c45d79]">Explore</p>
              <p className="journal-heading mt-2 text-2xl">Browse the journal sanctuary</p>
              <Link href="/journal" className="mt-4 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#5c4033] ring-1 ring-[#fb6f92]/20 transition hover:-translate-y-0.5">
                Explore Journal
              </Link>
            </div>
          </div>
        </section>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          onSubmit={handleSubmit}
          className="glass-card paper-texture paper-shadow relative rounded-[2.5rem] border border-white/70 p-6 sm:p-8"
        >
          <div className="mb-6">
            <span className="inline-flex rounded-full border border-[#fb6f92]/20 bg-[#fff0f3] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c45d79]">
              Sign in
            </span>
            <h2 className="journal-heading mt-4 text-4xl text-[#5c4033]">Return to your desk</h2>
            <p className="mt-2 text-sm text-[#7a624f]">Use the email and password you registered with.</p>
          </div>

          <div className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email address"
              autoComplete="email"
              className="w-full rounded-[1.5rem] border border-[#fb6f92]/20 bg-white/90 px-4 py-3 outline-none transition focus:border-[#fb6f92] focus:ring-4 focus:ring-[#fb6f92]/10"
              required
            />
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                className="w-full rounded-[1.5rem] border border-[#fb6f92]/20 bg-white/90 px-4 py-3 pr-24 outline-none transition focus:border-[#fb6f92] focus:ring-4 focus:ring-[#fb6f92]/10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-[#fff0f3] px-3 py-2 text-xs font-semibold text-[#c45d79] ring-1 ring-[#fb6f92]/15"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error ? <p className="text-sm font-medium text-[#d13f5e]">{error}</p> : null}

            <button
              disabled={loading}
              className="w-full rounded-full bg-[#fb6f92] px-4 py-3 font-semibold text-white shadow-lg shadow-[#fb6f92]/25 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>
        </motion.form>
      </div>
    </main>
  );
}
