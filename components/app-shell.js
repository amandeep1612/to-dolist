"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/tasks", label: "Tasks", icon: CheckIcon },
  { href: "/journal", label: "Journal Sanctuary", icon: JournalIcon },
  { href: "/calendar", label: "Calendar", icon: CalendarIcon },
  { href: "/analytics", label: "Analytics", icon: ChartIcon },
  { href: "/profile", label: "Profile", icon: ProfileIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon }
];

function DashboardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 4h7v7H4z" />
      <path d="M13 4h7v4h-7z" />
      <path d="M13 10h7v10h-7z" />
      <path d="M4 13h7v7H4z" />
    </svg>
  );
}
function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function JournalIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M6 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M8 7h8M8 11h8M8 15h5" />
    </svg>
  );
}
function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M7 3v3M17 3v3M4 8h16" />
      <path d="M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
function ChartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 19h16" />
      <path d="M7 16V9" />
      <path d="M12 16V5" />
      <path d="M17 16v-6" />
    </svg>
  );
}
function ProfileIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}
function SettingsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
      <path d="M19.4 15a8.3 8.3 0 0 0 .1-6l2-1.2-2-3.5-2.2.8a8.4 8.4 0 0 0-5-2.8L11.7 0H8.3l-.6 2.3a8.4 8.4 0 0 0-5 2.8L.5 4.3l-2 3.5 2 1.2a8.3 8.3 0 0 0 0 6l-2 1.2 2 3.5 2.2-.8a8.4 8.4 0 0 0 5 2.8l.6 2.3h3.4l.6-2.3a8.4 8.4 0 0 0 5-2.8l2.2.8 2-3.5-2-1.2Z" opacity=".0" />
    </svg>
  );
}

export default function AppShell({ children, user }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#faf3e8_0%,#f3e8d7_100%)] text-[#5c4033]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[290px_1fr]">
        <aside className="sticky top-0 hidden h-screen border-r border-[#d4a373]/20 bg-[rgba(250,243,224,0.82)] px-5 py-6 backdrop-blur lg:block">
          <div className="flex h-full flex-col rounded-[2.25rem] border border-white/70 bg-[rgba(255,253,248,0.8)] p-4 shadow-[0_18px_50px_rgba(92,64,51,0.08)]">
            <div className="mb-6 rounded-[1.8rem] border border-[#d4a373]/20 bg-[#faf3e0] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8b5e3c]">Velora</p>
              <h1 className="journal-heading mt-2 text-4xl text-[#5c4033]">Library desk</h1>
              <p className="mt-2 text-sm leading-6 text-[#7a624f]">
                {user?.name || user?.email || "Welcome back"}
              </p>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-[1.35rem] px-4 py-3 transition ${
                      active
                        ? "bg-[#8b5e3c] text-[#faf3e0] shadow-lg shadow-[#8b5e3c]/20"
                        : "bg-transparent text-[#5c4033] hover:bg-[#faf3e0]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-3 rounded-[1.7rem] border border-[#d4a373]/20 bg-[#faf3e0] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e3c]">Current page</p>
              <p className="journal-script mt-2 text-3xl text-[#5c4033]">
                {navItems.find((item) => item.href === pathname)?.label || "Dashboard"}
              </p>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full rounded-full bg-[#fb6f92] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#fb6f92]/20 transition hover:-translate-y-0.5"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 border-b border-[#d4a373]/20 bg-[rgba(250,243,224,0.82)] px-4 py-3 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between rounded-[1.5rem] border border-white/70 bg-[rgba(255,253,248,0.92)] px-4 py-3 shadow-[0_12px_30px_rgba(92,64,51,0.08)]">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#8b5e3c]">Velora</p>
                <p className="journal-heading text-2xl text-[#5c4033]">
                  {navItems.find((item) => item.href === pathname)?.label || "Dashboard"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/login" className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#5c4033] ring-1 ring-[#fb6f92]/20">
                  Login
                </Link>
                <Link href="/register" className="rounded-full bg-[#fb6f92] px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-[#fb6f92]/20">
                  Sign Up
                </Link>
                <Link href="/dashboard" className="rounded-full bg-[#faf3e0] px-3 py-2 text-xs font-semibold ring-1 ring-[#d4a373]/20">
                  Home
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-full bg-[#8b5e3c] px-3 py-2 text-xs font-semibold text-[#faf3e0]"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mx-auto max-w-[1320px]"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>

          <nav className="sticky bottom-0 z-20 border-t border-[#d4a373]/20 bg-[rgba(250,243,224,0.92)] p-3 backdrop-blur lg:hidden">
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {navItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center gap-1 rounded-[1.1rem] px-2 py-2 text-[11px] transition ${
                      active ? "bg-[#8b5e3c] text-[#faf3e0]" : "text-[#5c4033]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="truncate">{item.label.split(" ")[0]}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
