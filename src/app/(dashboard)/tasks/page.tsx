"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function TasksPage() {
  const [filter, setFilter] = useState("Shopping"); // Default filter set to Shopping since "All" is removed
  const [toast, setToast] = useState<{ message: string; type: "done" | "skip" } | null>(null);

  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: "Polythene kena", 
      turn: "Rubel", 
      category: "Shopping", 
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ) 
    },
    { 
      id: 2, 
      title: "Vimbar kena", 
      turn: "Arefin", 
      category: "Shopping", 
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ) 
    },
    { 
      id: 3, 
      title: "Harpic kena", 
      turn: "Real", 
      category: "Cleaning", 
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ) 
    },
    { 
      id: 4, 
      title: "Washroom clean kora", 
      turn: "Raju", 
      category: "Cleaning", 
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ) 
    },
    { 
      id: 5, 
      title: "Electricity Bill pay", 
      turn: "Tanvir", 
      category: "Bills", 
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ) 
    },
  ]);

  const showToastMsg = (message: string, type: "done" | "skip") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 1500);
  };

  const handleDone = (id: number, title: string) => {
    showToastMsg(`Task "${title}" marked as Done! 🎉`, "done");
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleSkip = (id: number, title: string) => {
    showToastMsg(`Task "${title}" skipped for today! ⏭️`, "skip");
  };

  const filteredTasks = tasks.filter((t) => t.category.toLowerCase() === filter.toLowerCase());

  return (
    <main className="min-h-screen bg-[#070b19] text-white pb-28 pt-4 px-4 font-sans relative overflow-hidden">
      
      {toast && (
        <div className="fixed top-5 right-5 z-50 transition-all duration-300">
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

      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="max-w-md mx-auto space-y-5 relative z-10">
        
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

        {/* Filter Pills without "All", perfectly fitting mobile screen width */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {["Shopping", "Cleaning", "Bills"].map((item) => (
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

          {/* Task Details Direct Link Button */}
          <Link
            href="/tasks/detail"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-400/40 rounded-2xl text-xs font-extrabold transition whitespace-nowrap shadow-md shadow-blue-600/20 flex items-center gap-1 active:scale-95"
          >
            <span>Task Details</span>
            <span className="text-xs">›</span>
          </Link>
        </div>

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
                <Link href="/tasks/detail" className="flex items-center gap-3.5 flex-1">
                  <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shadow-inner">
                    {task.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white hover:text-blue-400 transition">{task.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Turn: <span className="font-bold text-blue-400">{task.turn}</span>
                    </p>
                  </div>
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDone(task.id, task.title)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-[11px] font-extrabold rounded-2xl shadow-md shadow-emerald-600/30 active:scale-95 transition flex items-center gap-1"
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

      <BottomNav />
    </main>
  );
}