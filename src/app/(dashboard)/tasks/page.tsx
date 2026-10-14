"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";

export default function TasksPage() {
  const [filter, setFilter] = useState("All");
  const [toast, setToast] = useState<{ message: string; type: "done" | "skip" } | null>(null);

  // Initial Task List with categories
  const [tasks, setTasks] = useState([
    { id: 1, title: "Polythene kena", turn: "Rubel", category: "Shopping", icon: "🛒" },
    { id: 2, title: "Vimbar kena", turn: "Arefin", category: "Shopping", icon: "🛒" },
    { id: 3, title: "Harpic kena", turn: "Real", category: "Cleaning", icon: "🧹" },
    { id: 4, title: "Washroom clean kora", turn: "Raju", category: "Cleaning", icon: "✨" },
    { id: 5, title: "Electricity Bill pay", turn: "Tanvir", category: "Bills", icon: "💳" },
  ]);

  // Show Toast Helper
  const showToastMsg = (message: string, type: "done" | "skip") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Handle Done Action
  const handleDone = (id: number, title: string) => {
    showToastMsg(`Task "${title}" marked as Done! 🎉`, "done");
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Handle Skip Action
  const handleSkip = (id: number, title: string) => {
    showToastMsg(`Task "${title}" skipped for today! ⏭️`, "skip");
    // Optionally rotate turn or move item
  };

  // Filtered Tasks
  const filteredTasks = filter === "All" 
    ? tasks 
    : tasks.filter((t) => t.category.toLowerCase() === filter.toLowerCase());

  return (
    <main className="min-h-screen bg-[#070b19] text-white pb-28 pt-4 px-4 font-sans relative overflow-hidden">
      
      {/* Top Right Toast Notification Popup */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-bounce transition-all duration-300">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs font-bold ${
            toast.type === "done" 
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-300 shadow-emerald-900/50" 
              : "bg-amber-950/90 border-amber-500/50 text-amber-300 shadow-amber-900/50"
          }`}>
            <span className="text-base">{toast.type === "done" ? "✅" : "⏭️"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Background Dot Matrix Pattern */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="max-w-md mx-auto space-y-5 relative z-10">
        
        {/* Page Title & Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-white tracking-tight">Step 1: Queue Tasks</h1>
            <p className="text-xs text-slate-400 font-medium">Chores & grocery turn rotations</p>
          </div>
          <button 
            type="button"
            className="w-9 h-9 bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-full font-bold flex items-center justify-center text-lg hover:bg-blue-600 hover:text-white transition shadow-md active:scale-95"
            onClick={() => showToastMsg("Add task modal coming soon!", "done")}
          >
            +
          </button>
        </div>

        {/* Category Filter Pills (Fully Functional) */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {["All", "Shopping", "Cleaning", "Bills"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap active:scale-95 ${
                filter === item
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-500"
                  : "bg-[#0b132b] text-slate-300 border border-[#1e293b] hover:bg-slate-800"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Task Queue List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-[#0b132b] rounded-3xl border border-[#1e293b] p-6">
              <p className="text-sm font-bold text-slate-400">No tasks found in this category!</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-[#0b132b] rounded-3xl p-4 border border-[#1e293b]/80 shadow-lg flex items-center justify-between transition hover:border-blue-500/30"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center text-lg shadow-inner">
                    {task.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{task.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Turn: <span className="font-bold text-blue-400">{task.turn}</span>
                    </p>
                  </div>
                </div>

                {/* Gorgeous Done & Skip Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDone(task.id, task.title)}
                    className="px-4 py-2 bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-[11px] font-extrabold rounded-2xl shadow-md shadow-emerald-600/30 active:scale-95 transition flex items-center gap-1"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => handleSkip(task.id, task.title)}
                    className="px-3.5 py-2 bg-[#141e38] hover:bg-[#1a2647] text-slate-300 border border-slate-700/60 text-[11px] font-bold rounded-2xl active:scale-95 transition"
                  >
                    Skip
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Persistent Bottom Nav */}
      <BottomNav />
    </main>
  );
}