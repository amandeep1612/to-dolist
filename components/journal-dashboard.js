"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const moods = ["happy", "tired", "focused", "anxious", "calm"];
const prompts = [
  "What made you happy today?",
  "What distracted you today?",
  "What are you grateful for?"
];

const emptyEntry = {
  id: "",
  title: "",
  content: "",
  mood: "calm",
  reflection: prompts[0],
  isPinned: false,
  isDraft: true
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1 }
};

const dustVariants = {
  animate: (i) => ({
    opacity: [0.08, 0.3, 0.08],
    y: [0, -6 - i * 2, 0],
    x: [0, i % 2 ? 4 : -4, 0],
    transition: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" }
  })
};

function ScrapTape({ className = "" }) {
  return <span className={`absolute h-6 w-20 rounded-full bg-[linear-gradient(180deg,rgba(250,243,224,0.95),rgba(230,204,178,0.9))] shadow-[0_8px_16px_rgba(92,64,51,0.12)] ${className}`} />;
}

export default function JournalDashboard({ initialEntries }) {
  const [entries, setEntries] = useState(initialEntries);
  const [entry, setEntry] = useState(emptyEntry);
  const [savedAt, setSavedAt] = useState("");
  const [busy, setBusy] = useState(false);

  const pinned = useMemo(() => entries.find((item) => item.isPinned) || entries[0], [entries]);
  const recent = entries.slice(0, 4);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!entry.title.trim() && !entry.content.trim()) return;
      await saveEntry(true);
    }, 1800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.title, entry.content, entry.mood, entry.reflection, entry.isPinned]);

  async function saveEntry(isDraft = false) {
    setBusy(true);
    const payload = {
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      reflection: entry.reflection,
      isPinned: entry.isPinned,
      isDraft
    };

    const response = await fetch(entry.id ? `/api/journal/${entry.id}` : "/api/journal", {
      method: entry.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setBusy(false);
    if (!response.ok) return;

    const data = await response.json();
    const saved = data.entry;
    setEntry({
      id: saved.id,
      title: saved.title,
      content: saved.content,
      mood: saved.mood,
      reflection: saved.reflection || prompts[0],
      isPinned: saved.isPinned,
      isDraft: saved.isDraft
    });
    setEntries((current) => {
      const rest = current.filter((item) => item.id !== saved.id);
      return [saved, ...rest];
    });
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }

  async function deleteEntry(id) {
    const response = await fetch(`/api/journal/${id}`, { method: "DELETE" });
    if (!response.ok) return;
    setEntries((current) => current.filter((item) => item.id !== id));
    if (entry.id === id) setEntry(emptyEntry);
  }

  function openEntry(selected) {
    setEntry({
      id: selected.id,
      title: selected.title || "",
      content: selected.content || "",
      mood: selected.mood || "calm",
      reflection: selected.reflection || prompts[0],
      isPinned: selected.isPinned || false,
      isDraft: selected.isDraft ?? true
    });
  }

  return (
    <section className="relative overflow-hidden rounded-[2.75rem] border border-white/60 bg-[linear-gradient(180deg,rgba(250,243,224,0.88),rgba(245,230,211,0.92))] p-4 shadow-[0_28px_70px_rgba(92,64,51,0.12)] sm:p-5">
      <div className="pointer-events-none absolute inset-0 paper-noise opacity-70" />
      <div className="pointer-events-none absolute left-6 top-6 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(139,94,60,0.18),transparent_65%)] blur-sm" />
      <div className="pointer-events-none absolute right-10 top-20 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(212,163,115,0.22),transparent_65%)] blur-sm" />
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={dustVariants}
          animate="animate"
          className="pointer-events-none absolute rounded-full bg-[#5c4033]/20"
          style={{
            top: `${8 + i * 9}%`,
            left: `${6 + (i % 5) * 12}%`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`
          }}
        />
      ))}

      <div className="relative grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[2.5rem] border border-[#8b5e3c]/20 bg-[#faf3e0] shadow-[0_22px_50px_rgba(92,64,51,0.14)] soft-panel-hover"
        >
          <div className="absolute inset-0 paper-noise opacity-70" />
          <div className="absolute -left-4 top-8 h-28 w-28 rounded-full bg-[#d4a373]/10 blur-2xl" />
          <ScrapTape className="left-8 top-5 rotate-[-6deg]" />
          <ScrapTape className="right-10 top-8 rotate-[8deg]" />

          <div className="relative p-5 sm:p-6 lg:p-7">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
              <div className="min-w-0 max-w-xl">
                <p className="journal-script text-2xl text-[#8b5e3c]">Dear diary,</p>
                <h2 className="journal-heading mt-2 text-balance text-3xl leading-[1.08] text-[#5c4033] sm:text-4xl lg:text-5xl">
                  Capture the soft, private moments of the day.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#6f5847]">
                  A scrapbook-like space for memories, moods, notes, and little emotional snapshots.
                </p>
              </div>
              <div className="self-start rounded-[1.75rem] border border-[#8b5e3c]/15 bg-white/70 px-4 py-3 shadow-[0_12px_24px_rgba(92,64,51,0.1)]">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#8b5e3c]">today's mood</p>
                <p className="journal-script mt-1 text-4xl text-[#5c4033]">{entry.mood}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.04fr_0.96fr]">
              <motion.div
                whileHover={{ rotate: -0.5, y: -3 }}
                className="relative rounded-[2.35rem] border border-[#d4a373]/25 bg-[#fffdf8] p-4 shadow-[0_18px_30px_rgba(92,64,51,0.12)] soft-panel-hover"
              >
                <div className="absolute left-4 top-4 h-8 w-24 rotate-[-3deg] rounded-full bg-[#e6ccb2]/80" />
                <div className="absolute right-4 top-5 h-10 w-10 rotate-[10deg] rounded-full border border-[#d4a373]/35 bg-white/80" />
                <div className="overflow-hidden rounded-[1.8rem] border border-[#d4a373]/20 bg-[linear-gradient(180deg,#fbf6ed,#f4eadc)] p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="journal-script text-2xl leading-none text-[#8b5e3c]">memory page</span>
                    <span className="rounded-full bg-[#faf3e0] px-3 py-1 text-[11px] font-semibold text-[#8b5e3c] ring-1 ring-[#d4a373]/20">
                      pinned paper
                    </span>
                  </div>
                  <div className="torn-edge relative rounded-[1.5rem] bg-white/85 p-4 shadow-[0_14px_25px_rgba(92,64,51,0.08)]">
                    <div className="flex items-start gap-4">
                      <div className="flex h-28 w-24 shrink-0 items-end justify-center rounded-[1.15rem] border border-[#d4a373]/20 bg-[linear-gradient(180deg,#fffdf7,#f5e6d3)] shadow-[0_14px_24px_rgba(92,64,51,0.08)]">
                        <div className="mb-4 h-16 w-16 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(139,94,60,0.22),rgba(139,94,60,0.06))]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-[0.28em] text-[#8b5e3c]">reflection prompt</p>
                        <p className="journal-heading mt-2 text-balance text-2xl leading-tight text-[#5c4033] sm:text-3xl">
                          {entry.reflection || prompts[0]}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-[#6f5847]">
                          Write the memory, keep the feeling, and let the page remember it with you.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid gap-4">
                <div className="rounded-[2rem] border border-[#d4a373]/25 bg-[#fffdf8] p-4 shadow-[0_12px_24px_rgba(92,64,51,0.1)] soft-panel-hover">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e3c]">mood tracker</p>
                    <span className="journal-script text-2xl text-[#5c4033]">{entry.mood}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {moods.map((mood) => (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => setEntry({ ...entry, mood })}
                        className={`rounded-full px-3 py-2 text-sm transition ${
                          entry.mood === mood
                            ? "bg-[#8b5e3c] text-[#faf3e0] shadow-lg shadow-[#8b5e3c]/20"
                            : "bg-[#faf3e0] text-[#5c4033] ring-1 ring-[#d4a373]/20"
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[#d4a373]/25 bg-[linear-gradient(180deg,#fffefb,#f7eddc)] p-4 shadow-[0_12px_24px_rgba(92,64,51,0.1)] soft-panel-hover">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e3c]">autosave</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-sm text-[#6f5847]">
                      {savedAt ? `Saved at ${savedAt}` : "Drafts are saved automatically"}
                    </p>
                    <button
                      onClick={() => saveEntry(false)}
                      className="rounded-full bg-[#8b5e3c] px-4 py-2 text-sm font-semibold text-[#faf3e0]"
                    >
                      {busy ? "Saving..." : "Save page"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[2.35rem] border border-[#d4a373]/25 bg-[#fffdf8] p-4 shadow-[0_18px_30px_rgba(92,64,51,0.1)] soft-panel-hover">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e3c]">writing mode</p>
                  <span className="journal-script text-xl text-[#5c4033]">cozy desk</span>
                </div>
                <input
                  value={entry.title}
                  onChange={(e) => setEntry({ ...entry, title: e.target.value })}
                  placeholder="Entry title"
                  className="mt-4 w-full rounded-[1.5rem] border border-[#d4a373]/25 bg-white/90 px-4 py-3 outline-none"
                />
                <select
                  value={entry.reflection}
                  onChange={(e) => setEntry({ ...entry, reflection: e.target.value })}
                  className="mt-3 w-full rounded-[1.5rem] border border-[#d4a373]/25 bg-white/90 px-4 py-3 outline-none"
                >
                  {prompts.map((prompt) => (
                    <option key={prompt} value={prompt}>
                      {prompt}
                    </option>
                  ))}
                </select>
                <textarea
                  value={entry.content}
                  onChange={(e) => setEntry({ ...entry, content: e.target.value })}
                  rows={10}
                  placeholder="Write freely..."
                  className="mt-3 w-full rounded-[2rem] border border-[#d4a373]/25 bg-[linear-gradient(180deg,#fff,#fbf7ef)] px-4 py-4 leading-7 outline-none"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <label className="flex items-center gap-3 text-sm text-[#6f5847]">
                    <input
                      type="checkbox"
                      checked={entry.isPinned}
                      onChange={(e) => setEntry({ ...entry, isPinned: e.target.checked })}
                    />
                    Pin this page
                  </label>
                  <button
                    onClick={() => saveEntry(false)}
                    className="rounded-full bg-[#5c4033] px-5 py-3 text-sm font-semibold text-[#faf3e0]"
                  >
                    {busy ? "Saving..." : "Seal page"}
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[2.35rem] border border-[#d4a373]/25 bg-[#fffdf8] p-4 shadow-[0_18px_30px_rgba(92,64,51,0.1)] soft-panel-hover">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e3c]">photo support</p>
                    <p className="journal-script text-2xl text-[#5c4033]">polaroid</p>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="tape relative rounded-[1.5rem] bg-white p-3 shadow-[0_14px_24px_rgba(92,64,51,0.1)]">
                      <div className="flex aspect-[3/4] items-center justify-center rounded-[1.15rem] bg-[linear-gradient(180deg,#e9ddcf,#faf3e0)]">
                        <span className="journal-script text-3xl text-[#8b5e3c]">photo</span>
                      </div>
                    </div>
                    <div className="tape relative rounded-[1.5rem] bg-white p-3 shadow-[0_14px_24px_rgba(92,64,51,0.1)]">
                      <div className="flex aspect-[3/4] items-center justify-center rounded-[1.15rem] bg-[linear-gradient(180deg,#efe5d8,#f8f1e3)]">
                        <span className="journal-script text-3xl text-[#8b5e3c]">memory</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2.35rem] border border-[#d4a373]/25 bg-[#fffdf8] p-4 shadow-[0_18px_30px_rgba(92,64,51,0.1)] soft-panel-hover">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e3c]">scrapbook timeline</p>
                  <div className="mt-4 space-y-3">
                    <AnimatePresence>
                      {recent.map((item, index) => (
                        <motion.div
                          key={item.id}
                          layout
                          variants={cardVariants}
                          initial="hidden"
                          animate="show"
                          exit="hidden"
                          onClick={() => openEntry(item)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              openEntry(item);
                            }
                          }}
                          className={`relative w-full cursor-pointer rounded-[1.7rem] border border-[#d4a373]/25 bg-[linear-gradient(180deg,#fffefb,#f6ead9)] p-4 text-left shadow-[0_12px_24px_rgba(92,64,51,0.1)] transition hover:-translate-y-0.5 ${index % 2 ? "translate-x-1" : ""}`}
                        >
                          <div className="absolute right-3 top-3 h-3 w-3 rounded-full bg-[#d4a373]/60" />
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="journal-script text-2xl text-[#8b5e3c]">{item.mood}</p>
                              <h4 className="journal-heading mt-1 break-words text-xl leading-tight text-[#5c4033] sm:text-2xl">
                                {item.title || "Untitled page"}
                              </h4>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteEntry(item.id);
                              }}
                              className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#8b5e3c] ring-1 ring-[#d4a373]/20"
                            >
                              Tear out
                            </button>
                          </div>
                          <p className="mt-3 break-words text-sm leading-6 text-[#6f5847]">{item.content}</p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {pinned ? (
              <div className="mt-6 rounded-[2.35rem] border border-dashed border-[#d4a373]/35 bg-white/70 p-5 shadow-[0_12px_24px_rgba(92,64,51,0.08)] soft-panel-hover">
                <p className="journal-script text-3xl text-[#8b5e3c]">Pinned page</p>
                <p className="journal-heading mt-2 text-balance text-2xl leading-tight text-[#5c4033] sm:text-3xl">{pinned.title || "Untitled page"}</p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f5847]">
                  This page stays on the board like a favorite scrapbook clipping.
                </p>
              </div>
            ) : null}
          </div>
        </motion.div>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="torn-top relative overflow-hidden rounded-[2rem] border border-[#d4a373]/25 bg-[linear-gradient(180deg,#fffdf8,#f4eadc)] p-5 shadow-[0_16px_28px_rgba(92,64,51,0.1)]">
              <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e3c]">mood tracker</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <span
                    key={mood}
                    className={`rounded-full px-3 py-2 text-sm ${
                      entry.mood === mood
                        ? "bg-[#8b5e3c] text-[#faf3e0]"
                        : "bg-[#faf3e0] text-[#5c4033] ring-1 ring-[#d4a373]/25"
                    }`}
                  >
                    {mood}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-[#d4a373]/25 bg-[linear-gradient(180deg,#fff,#f8f1e5)] p-5 shadow-[0_16px_28px_rgba(92,64,51,0.1)]">
              <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-[radial-gradient(circle,rgba(139,94,60,0.18),transparent_68%)] blur-sm" />
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e3c]">reflection prompt</p>
              <p className="journal-heading mt-4 text-2xl leading-tight text-[#5c4033] sm:text-3xl">
                {entry.reflection || prompts[0]}
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.35rem] border border-[#d4a373]/25 bg-[linear-gradient(180deg,#fffef9,#f6ead7)] p-5 shadow-[0_16px_28px_rgba(92,64,51,0.1)]">
            <div className="absolute inset-0 paper-noise opacity-70" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e3c]">handwritten note</p>
              <p className="journal-script mt-3 text-3xl leading-tight text-[#5c4033] sm:text-4xl">
                {savedAt ? `Saved at ${savedAt}` : "Autosave will keep drafts safe"}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#6f5847]">
                Soft fades, paper texture, and cozy storytelling keep the sanctuary intimate and alive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
