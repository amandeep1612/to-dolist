"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

const emptyForm = {
  id: "",
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  categoryId: "",
  dueDate: ""
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 }
};

export default function TaskManager({ initialTasks, categories }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const editing = Boolean(form.id);
  const sortedTasks = useMemo(() => tasks, [tasks]);

  function resetForm() {
    setForm(emptyForm);
    setError("");
  }

  async function submitTask(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const payload = {
      title: form.title,
      description: form.description,
      priority: form.priority,
      status: form.status,
      categoryId: form.categoryId || null,
      dueDate: form.dueDate || null
    };

    const response = await fetch(editing ? `/api/tasks/${form.id}` : "/api/tasks", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setBusy(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data?.error || "Something went wrong.");
      return;
    }

    const data = await response.json();
    const task = data.task;

    setTasks((current) => (editing ? current.map((item) => (item.id === task.id ? task : item)) : [task, ...current]));
    resetForm();
  }

  async function deleteTask(id) {
    const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!response.ok) return;
    setTasks((current) => current.filter((task) => task.id !== id));
    if (form.id === id) resetForm();
  }

  async function toggleComplete(task) {
    const nextStatus = task.status === "done" ? "todo" : "done";
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus })
    });

    if (!response.ok) return;
    const data = await response.json();
    setTasks((current) => current.map((item) => (item.id === task.id ? data.task : item)));
  }

  function startEdit(task) {
    setForm({
      id: task.id,
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "medium",
      status: task.status || "todo",
      categoryId: task.categoryId || "",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ""
    });
    setError("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[390px_1fr]">
      <motion.form
        layout
        onSubmit={submitTask}
        className="glass-card paper-texture paper-shadow rounded-[2.5rem] border border-white/70 p-6 sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#8b5e3c]">Task ledger</p>
            <h2 className="journal-heading mt-2 text-3xl text-[#5c4033]">{editing ? "Revise task" : "Create task"}</h2>
          </div>
          <div className="rounded-2xl bg-[#faf3e0] px-3 py-2 text-xs font-semibold text-[#8b5e3c] ring-1 ring-[#d4a373]/30">
            {editing ? "Editing" : "New leaf"}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-[1.5rem] border border-[#d4a373]/35 bg-white/85 px-4 py-3 outline-none transition focus:border-[#8b5e3c] focus:ring-4 focus:ring-[#d4a373]/15"
            placeholder="Task title"
            required
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-[1.5rem] border border-[#d4a373]/35 bg-white/85 px-4 py-3 outline-none transition focus:border-[#8b5e3c] focus:ring-4 focus:ring-[#d4a373]/15"
            placeholder="Description"
            rows={5}
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="rounded-[1.5rem] border border-[#d4a373]/35 bg-white/85 px-4 py-3 outline-none transition focus:border-[#8b5e3c] focus:ring-4 focus:ring-[#d4a373]/15"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="rounded-[1.5rem] border border-[#d4a373]/35 bg-white/85 px-4 py-3 outline-none transition focus:border-[#8b5e3c] focus:ring-4 focus:ring-[#d4a373]/15"
            >
              <option value="todo">To do</option>
              <option value="done">Done</option>
            </select>
          </div>

          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full rounded-[1.5rem] border border-[#d4a373]/35 bg-white/85 px-4 py-3 outline-none transition focus:border-[#8b5e3c] focus:ring-4 focus:ring-[#d4a373]/15"
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            type="datetime-local"
            className="w-full rounded-[1.5rem] border border-[#d4a373]/35 bg-white/85 px-4 py-3 outline-none transition focus:border-[#8b5e3c] focus:ring-4 focus:ring-[#d4a373]/15"
          />

          {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              disabled={busy}
              className="rounded-full bg-[#8b5e3c] px-5 py-3 text-sm font-semibold text-[#faf3e0] shadow-lg shadow-[#8b5e3c]/20 transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {busy ? "Saving..." : editing ? "Update task" : "Create task"}
            </button>
            {editing ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#5c4033] ring-1 ring-[#d4a373]/30 transition hover:-translate-y-0.5"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </div>
      </motion.form>

      <div className="space-y-4">
        <div className="glass-card paper-texture paper-shadow rounded-[2.5rem] border border-white/70 p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#8b5e3c]">Task archive</p>
              <h2 className="journal-heading mt-2 text-3xl text-[#5c4033]">Your pinned paper board</h2>
            </div>
            <span className="rounded-full bg-[#faf3e0] px-4 py-2 text-sm font-medium text-[#5c4033] ring-1 ring-[#d4a373]/30">
              {sortedTasks.length} items
            </span>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            <AnimatePresence initial={false}>
              {sortedTasks.length ? (
                sortedTasks.map((task) => (
                  <motion.article
                    key={task.id}
                    layout
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    transition={{ duration: 0.22 }}
                    className="rounded-[2rem] bg-[#fffdf8] p-5 shadow-[0_12px_28px_rgba(92,64,51,0.08)] ring-1 ring-[#d4a373]/25"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={`journal-serif text-3xl ${task.status === "done" ? "text-[#a38a77] line-through" : "text-[#5c4033]"}`}>
                            {task.title}
                          </h3>
                          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${task.priority === "high" ? "bg-[#e6ccb2] text-[#5c4033]" : task.priority === "low" ? "bg-[#f5e6d3] text-[#8b5e3c]" : "bg-[#faf3e0] text-[#8b5e3c]"}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[#6f5847]">{task.description || "No description"}</p>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full bg-[#faf3e0] px-3 py-1 font-medium text-[#8b5e3c]">
                            {task.status === "done" ? "Completed" : "In progress"}
                          </span>
                          {task.category?.name ? (
                            <span className="rounded-full bg-white px-3 py-1 font-medium text-[#6f5847] ring-1 ring-[#d4a373]/25">
                              {task.category.name}
                            </span>
                          ) : null}
                          {task.dueDate ? (
                            <span className="rounded-full bg-white px-3 py-1 font-medium text-[#6f5847] ring-1 ring-[#d4a373]/25">
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col gap-2">
                        <button
                          onClick={() => toggleComplete(task)}
                          className="rounded-full bg-[#faf3e0] px-3 py-2 text-xs font-semibold text-[#5c4033] ring-1 ring-[#d4a373]/30 transition hover:-translate-y-0.5"
                        >
                          {task.status === "done" ? "Undo" : "Complete"}
                        </button>
                        <button
                          onClick={() => startEdit(task)}
                          className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#5c4033] ring-1 ring-[#d4a373]/25 transition hover:-translate-y-0.5"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#8b5e3c] ring-1 ring-[#e6ccb2] transition hover:-translate-y-0.5"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-[2rem] border border-dashed border-[#d4a373]/40 bg-white/60 p-10 text-center text-[#7a624f]"
                >
                  No tasks yet. Add a page to your notebook.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
