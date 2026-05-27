"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data?.error || "Registration failed.");
      return;
    }

    setSuccess("Account created. Redirecting to login...");
    setTimeout(() => router.push("/login"), 900);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,183,197,0.28),transparent_30%),linear-gradient(180deg,#fff7f9_0%,#fff0f3_48%,#f5e6d3_100%)] px-4 py-8 text-[#5c4033] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 paper-grid opacity-20" />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <span className="inline-flex rounded-full border border-[#fb6f92]/20 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c45d79] shadow-[0_12px_28px_rgba(92,64,51,0.08)]">
            New chapter
          </span>
          <h1 className="journal-heading max-w-xl text-5xl leading-[0.95] sm:text-6xl">
            Create your Velora account and begin beautifully.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-[#7a624f]">
            A soft productivity system with a journal heart, designed to feel premium, emotional, and easy to keep using.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-[0_18px_40px_rgba(92,64,51,0.08)]">
              <p className="text-xs uppercase tracking-[0.24em] text-[#c45d79]">Already here?</p>
              <p className="journal-heading mt-2 text-2xl">Jump back in</p>
              <Link href="/login" className="mt-4 inline-flex rounded-full bg-[#8b5e3c] px-5 py-3 text-sm font-semibold text-[#faf3e0] shadow-lg shadow-[#8b5e3c]/20 transition hover:-translate-y-0.5">
                Login
              </Link>
            </div>
            <div className="rounded-[2rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,240,243,0.82))] p-5 shadow-[0_18px_40px_rgba(92,64,51,0.08)]">
              <p className="text-xs uppercase tracking-[0.24em] text-[#c45d79]">Preview</p>
              <p className="journal-heading mt-2 text-2xl">Planner + journal</p>
              <Link href="/tasks" className="mt-4 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#5c4033] ring-1 ring-[#fb6f92]/20 transition hover:-translate-y-0.5">
                Explore Tasks
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
              Sign up
            </span>
            <h2 className="journal-heading mt-4 text-4xl text-[#5c4033]">Start your first page</h2>
            <p className="mt-2 text-sm text-[#7a624f]">Create an account to save tasks, reflections, and journal pages.</p>
          </div>

          <div className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Name"
              autoComplete="name"
              className="w-full rounded-[1.5rem] border border-[#fb6f92]/20 bg-white/90 px-4 py-3 outline-none transition focus:border-[#fb6f92] focus:ring-4 focus:ring-[#fb6f92]/10"
              required
            />
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
                autoComplete="new-password"
                minLength={8}
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
            {success ? <p className="text-sm font-medium text-[#8b5e3c]">{success}</p> : null}

            <button
              disabled={loading}
              className="w-full rounded-full bg-[#fb6f92] px-4 py-3 font-semibold text-white shadow-lg shadow-[#fb6f92]/25 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </motion.form>
      </div>
    </main>
  );
}
