"use client";

import { useState } from "react";

export default function TasksPage() {
  const [filter, setFilter] = useState("All");

  const tasks = [
    { id: 1, title: "Polythene kena", turn: "Rubel", type: "shopping", icon: "🛒" },
    { id: 2, title: "Vimbar kena", turn: "Arefin", type: "shopping", icon: "🛒" },
    { id: 3, title: "Harpic kena", turn: "Real", type: "shopping", icon: "🛒" },
    { id: 4, title: "Washroom clean kora", turn: "Raju", type: "cleaning", icon: "✨" },
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-24 pt-4 px-4 space-y-5">
      {/* Page Title & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight">Step 1: Queue Tasks</h1>
          <p className="text-xs text-slate-400 font-medium">Chores & grocery turn rotations</p>
        </div>
        <button className="w-9 h-9 bg-blue-50 text-blue-600 rounded-full font-bold flex items-center justify-center text-lg hover:bg-blue-100 transition">
          +
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {["All", "Shopping", "Cleaning", "Bills"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
              filter === item
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-100"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Task Queue List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                {task.icon}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">{task.title}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Turn: <span className="font-bold text-blue-600">{task.turn}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3.5 py-2 bg-emerald-600 text-white text-[11px] font-bold rounded-2xl shadow-sm hover:bg-emerald-700 active:scale-95 transition">
                Kinlam / Done
              </button>
              <button className="px-3 py-2 bg-slate-100 text-slate-500 text-[11px] font-bold rounded-2xl hover:bg-slate-200 transition">
                Skip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}