"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

export default function TaskDetailPage() {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);

  // All Tasks list for sliding/arrow navigation
  const [tasksList, setTasksList] = useState([
    {
      id: 1,
      title: "Polythene kena",
      category: "Shopping Category",
      currentIndex: 1, // Rubel
    },
    {
      id: 2,
      title: "Vimbar kena",
      category: "Shopping Category",
      currentIndex: 2, // Arefin
    },
    {
      id: 3,
      title: "Harpic kena",
      category: "Cleaning Category",
      currentIndex: 3, // Real
    },
    {
      id: 4,
      title: "Washroom clean kora",
      category: "Cleaning Category",
      currentIndex: 4, // Raju
    },
  ]);

  const [activeTaskIndex, setActiveTaskIndex] = useState(0);

  // Rotation members list with local public folder avatars & fallbacks
  const rotationMembers = [
    { name: "Radin", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
    { name: "Rubel", avatar: "/Rubel.jpg" },
    { name: "Arefin", avatar: "/Arefin.jpg" },
    { name: "Real", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80" },
    { name: "Raju", avatar: "/Raju.jpg" },
  ];

  // Completion history state
  const [history, setHistory] = useState([
    { date: "12 Oct 2026", completedBy: "Radin", time: "09:30 AM" },
    { date: "05 Oct 2026", completedBy: "Raju", time: "08:15 PM" },
  ]);

  const currentTask = tasksList[activeTaskIndex];
  const currentPerson = rotationMembers[currentTask.currentIndex];

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 1500);
  };

  // Next Task Slider / Right Arrow handler
  const handleNextTask = () => {
    setActiveTaskIndex((prev) => (prev + 1) % tasksList.length);
  };

  // Previous Task handler
  const handlePrevTask = () => {
    setActiveTaskIndex((prev) => (prev - 1 + tasksList.length) % tasksList.length);
  };

  // Mark as Done & Rotate Turn
  const handleDoneAndRotate = () => {
    const previousPerson = currentPerson.name;
    const nextPersonIndex = (currentTask.currentIndex + 1) % rotationMembers.length;
    
    // Update current task's person index
    const updatedTasks = [...tasksList];
    updatedTasks[activeTaskIndex].currentIndex = nextPersonIndex;
    setTasksList(updatedTasks);

    // Add to completion history
    setHistory([{ date: "14 Oct 2026", completedBy: previousPerson, time: "Just now" }, ...history]);

    showToastMsg(`Task completed by ${previousPerson}! Turn rotated.`);
  };

  // Skip Turn Handler
  const handleSkipTurn = () => {
    const nextPersonIndex = (currentTask.currentIndex + 1) % rotationMembers.length;
    const nextPerson = rotationMembers[nextPersonIndex].name;

    const updatedTasks = [...tasksList];
    updatedTasks[activeTaskIndex].currentIndex = nextPersonIndex;
    setTasksList(updatedTasks);

    showToastMsg(`Turn skipped. Now assigned to ${nextPerson}. ⏭️`);
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 pb-28 pt-4 px-4 font-sans relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 transition-all duration-300">
          <div className="px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border bg-emerald-950/90 border-emerald-500/50 text-emerald-300 shadow-emerald-900/50 text-xs font-bold">
            <span className="text-base">✅</span>
            <span>{toast}</span>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto space-y-4">
        
        {/* Top Header with Back Button */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-sm text-sm font-bold active:scale-95 transition"
            >
              ←
            </button>
            <h1 className="text-base font-black text-slate-900">Task Detail</h1>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Task {activeTaskIndex + 1} of {tasksList.length}
          </span>
        </div>

        {/* Task Detail Main Card with Slider Arrows */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm text-center flex flex-col items-center space-y-4 relative">
          
          {/* Left & Right Slider Arrows */}
          <button 
            onClick={handlePrevTask}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition shadow-sm font-bold"
            title="Previous Task"
          >
            ‹
          </button>
          
          <button 
            onClick={handleNextTask}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition shadow-sm font-bold"
            title="Next Task"
          >
            ›
          </button>

          {/* Category Icon */}
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center shadow-inner mt-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h2 className="text-lg font-black text-slate-900">{currentTask.title}</h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">{currentTask.category}</p>
          </div>

          {/* Current Person In Charge Box */}
          <div className="w-full bg-blue-50/80 rounded-2xl p-3.5 border border-blue-100 flex flex-col items-center justify-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 mb-2">
              CURRENT PERSON IN CHARGE
            </span>
            <div className="flex items-center gap-2">
              <img 
                src={currentPerson.avatar} 
                alt={currentPerson.name} 
                className="w-7 h-7 rounded-full object-cover border-2 border-blue-600"
              />
              <span className="text-sm font-black text-slate-900">{currentPerson.name}</span>
            </div>
          </div>

          {/* Action Buttons: Done & Rotate + Skip */}
          <div className="w-full space-y-2 pt-1">
            <button
              onClick={handleDoneAndRotate}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-emerald-600/30 transition active:scale-[0.98]"
            >
              Mark as Done & Rotate Turn
            </button>
            <button
              onClick={handleSkipTurn}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 transition active:scale-[0.98]"
            >
              Skip Turn
            </button>
          </div>

        </div>

        {/* Rotation Order Section Card with Public Folder Avatars */}
        <div className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Rotation Order</h3>
          
          <div className="flex items-center justify-between overflow-x-auto py-2 px-1">
            {rotationMembers.map((member, index) => {
              const isCurrent = index === currentTask.currentIndex;
              const isCompleted = index < currentTask.currentIndex;

              return (
                <div key={member.name} className="flex items-center gap-1.5 relative">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full overflow-hidden p-0.5 transition-all ${
                        isCurrent ? "ring-2 ring-blue-600 scale-110 shadow-md" : "opacity-75"
                      }`}>
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-full" />
                      </div>
                      {/* Tick Mark Badge on Avatar */}
                      {isCompleted && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white shadow-sm">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold mt-1.5 ${isCurrent ? "text-blue-600" : "text-slate-500"}`}>
                      {member.name}
                    </span>
                  </div>
                  {index < rotationMembers.length - 1 && (
                    <span className="text-slate-300 text-xs font-bold mb-4">›</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion History Section Card */}
        <div className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Completion History</h3>
          
          <div className="space-y-2">
            {history.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-700">Completed by <strong className="text-slate-900">{item.completedBy}</strong></span>
                </div>
                <span className="text-[10px] font-medium text-slate-400">{item.date} • {item.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <BottomNav />
    </main>
  );
}