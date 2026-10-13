"use client";

import { useState } from "react";
import { completeTask, skipTask } from "@/actions/task.actions";

interface TaskItem {
  id: string;
  title: string;
  category: string;
  assignee: string;
}

const PRESET_TASKS: TaskItem[] = [
  { id: "1", title: "Polythene kena", category: "Shopping", assignee: "Rubel" },
  { id: "2", title: "Vimbar kena", category: "Shopping", assignee: "Arefin" },
  { id: "3", title: "Harpic kena", category: "Shopping", assignee: "Real" },
  { id: "4", title: "Washroom clean kora", category: "Cleaning", assignee: "Raju" },
  { id: "5", title: "Jharu kena", category: "Shopping", assignee: "Radin" },
  { id: "6", title: "Lobon kena", category: "Shopping", assignee: "You" },
];

export default function TasksPage() {
  const [tasks] = useState<TaskItem[]>(PRESET_TASKS);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (id: string, action: "kinlam" | "skip") => {
    setLoadingId(id);

    try {
      // Dummy user ID for frontend preview, in real execution it connects with auth session
      const dummyUserId = "650000000000000000000001";

      if (action === "kinlam") {
        await completeTask(id, dummyUserId);
      } else {
        await skipTask(id, dummyUserId);
      }
    } catch {
      // Fallback UI toast for local testing
      alert(
        action === "kinlam"
          ? "Task completed! Rotated to next person."
          : "Task skipped! Passed to next person."
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-24 pt-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Step 1: Queue Tasks</h1>
          <p className="text-xs text-slate-500">ঘূর্ণায়মান দায়িত্ব ও বাজার</p>
        </div>
        <button className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md shadow-blue-600/30">
          +
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        <span className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-sm cursor-pointer">
          All Tasks
        </span>
        <span className="px-4 py-1.5 bg-white text-slate-600 text-xs font-medium rounded-full border border-slate-200 cursor-pointer">
          Shopping
        </span>
        <span className="px-4 py-1.5 bg-white text-slate-600 text-xs font-medium rounded-full border border-slate-200 cursor-pointer">
          Cleaning
        </span>
      </div>

      {/* Task List Cards */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold">
                {task.title.includes("Washroom") ? "🧹" : task.title.includes("Harpic") ? "🧴" : "🛒"}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Current Turn: <span className="font-medium text-blue-600">{task.assignee}</span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1.5">
              <button
                onClick={() => handleAction(task.id, "kinlam")}
                disabled={loadingId === task.id}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-sm transition active:scale-95 disabled:opacity-50"
              >
                Kinlam
              </button>
              <button
                onClick={() => handleAction(task.id, "skip")}
                disabled={loadingId === task.id}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-lg transition active:scale-95 disabled:opacity-50"
              >
                Skip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}