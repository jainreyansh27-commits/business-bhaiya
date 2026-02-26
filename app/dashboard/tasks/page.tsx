"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [recurringTasks, setRecurringTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newRecurring, setNewRecurring] = useState("");
  const [loading, setLoading] = useState(true);
const [aiInsight, setAiInsight] = useState("");
const [loadingInsight, setLoadingInsight] = useState(false);
  const today = new Date().toISOString().split("T")[0];
const generateProductivityInsight = async () => {
  setLoadingInsight(true);

  const res = await fetch("/api/productivity-coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.completed).length,
      progress: progress,
    }),
  });

  const data = await res.json();

  if (data.insight) {
    setAiInsight(data.insight);
  }

  setLoadingInsight(false);
};
  /* ---------------- AUTO GENERATE DAILY TASKS ---------------- */
  const generateDailyTasks = async (userId: string) => {
    const { data: existing } = await supabase
      .from("daily_tasks")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today);

    if (existing && existing.length > 0) return;

    const { data: recurring } = await supabase
      .from("recurring_tasks")
      .select("*")
      .eq("user_id", userId)
      .eq("active", true);

    if (!recurring || recurring.length === 0) return;

    const insertData = recurring.map((task) => ({
      user_id: userId,
      title: task.title,
      completed: false,
      date: today,
      source: "recurring",
    }));

    await supabase.from("daily_tasks").insert(insertData);
  };

  /* ---------------- FETCH ---------------- */
  const fetchTasks = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await generateDailyTasks(user.id);

    const { data: daily } = await supabase
      .from("daily_tasks")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .order("created_at", { ascending: true });

    const { data: recurring } = await supabase
      .from("recurring_tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    setTasks(daily || []);
    setRecurringTasks(recurring || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ---------------- TOGGLE TASK ---------------- */
  const toggleTask = async (id: string, value: boolean) => {
    await supabase
      .from("daily_tasks")
      .update({ completed: value })
      .eq("id", id);

    fetchTasks();
  };

  /* ---------------- ADD MANUAL TASK ---------------- */
  const addManualTask = async () => {
    if (!newTask.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("daily_tasks").insert({
      user_id: user.id,
      title: newTask,
      completed: false,
      date: today,
      source: "manual",
    });

    setNewTask("");
    fetchTasks();
  };

  /* ---------------- ADD RECURRING TASK ---------------- */
  const addRecurringTask = async () => {
    if (!newRecurring.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("recurring_tasks").insert({
      user_id: user.id,
      title: newRecurring,
      active: true,
    });

    setNewRecurring("");
    fetchTasks();
  };
const deleteRecurringTask = async (id: string) => {
  await supabase
    .from("recurring_tasks")
    .delete()
    .eq("id", id);

  fetchTasks();
};
  /* ---------------- PROGRESS ---------------- */
  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (tasks.filter((t) => t.completed).length / tasks.length) * 100
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8 text-white space-y-12">

      <h1 className="text-3xl font-bold">Execution Center</h1>
      {/* ================= AI PRODUCTIVITY COACH ================= */}
<div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-gray-700 p-6 rounded-2xl">
  <div className="flex justify-between items-center mb-3">
    <h2 className="text-xl font-semibold">
      AI Productivity Coach
    </h2>
    <button
      onClick={generateProductivityInsight}
      className="bg-blue-600 px-4 py-2 rounded text-sm"
    >
      {loadingInsight ? "Analysing..." : "Analyse My Day"}
    </button>
  </div>

  <p className="text-gray-300 whitespace-pre-line">
    {aiInsight || "Click analyse to get execution feedback."}
  </p>
</div>

      {/* ================= RECURRING TASK MANAGER ================= */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">
          Daily Recurring Tasks
        </h2>

        <div className="flex gap-2 mb-4">
          <input
            value={newRecurring}
            onChange={(e) => setNewRecurring(e.target.value)}
            placeholder="Add recurring daily task..."
            className="flex-1 p-3 rounded bg-gray-800 border border-gray-700"
          />
          <button
            onClick={addRecurringTask}
            className="bg-green-600 px-4 rounded"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
  {recurringTasks.map((task) => (
    <div
      key={task.id}
      className="flex justify-between items-center bg-gray-800 p-3 rounded text-gray-300"
    >
      <span>{task.title}</span>

      <button
        onClick={() => deleteRecurringTask(task.id)}
        className="text-red-400 hover:text-red-300 text-sm"
      >
        Delete
      </button>
    </div>
  ))}
</div>
      </div>

      {/* ================= PROGRESS ================= */}
      <div>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm mt-2 text-gray-400">
          {progress}% Completed
        </p>
      </div>

      {/* ================= ADD MANUAL TASK ================= */}
      <div className="flex gap-2">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add temporary task for today..."
          className="flex-1 p-3 rounded bg-gray-800 border border-gray-700"
        />
        <button
          onClick={addManualTask}
          className="bg-blue-600 px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* ================= DAILY TASKS ================= */}
      <div className="space-y-3">
        {loading ? (
          <p>Loading...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks for today.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 bg-gray-800 p-4 rounded-xl"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) =>
                  toggleTask(task.id, e.target.checked)
                }
              />
              <span
                className={
                  task.completed
                    ? "line-through text-gray-500"
                    : ""
                }
              >
                {task.title}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}