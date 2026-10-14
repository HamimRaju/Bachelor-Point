"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

export default function TaskDetailPage() {
    const router = useRouter();
    const [toast, setToast] = useState<string | null>(null);

    // Logged-in user mockup (In production, fetched from session e.g. "Raju")
    const loggedInUser = "Raju";

    // Rotation members list
    const rotationMembers = [
        {
            name: "Radin",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        },
        { name: "Rubel", avatar: "/Rubel.jpg" },
        { name: "Arefin", avatar: "/Arefin.jpg" },
        {
            name: "Real",
            avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80",
        },
        { name: "Raju", avatar: "/Raju.jpg" },
    ];

    // Helper function to format current live date and time dynamically
    const getFormattedDateTime = () => {
        const now = new Date();
        const date = now.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
        const time = now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
        return { date, time };
    };

    // All Tasks list with dynamic history state
    const [tasksList, setTasksList] = useState([
        {
            id: 1,
            title: "Polythene kena",
            category: "Shopping Category",
            currentIndex: 4, // Raju (Logged in user)
            completedCount: 2,
            totalCycle: 5,
            memberStates: {
                Radin: "completed",
                Rubel: "completed",
                Arefin: "pending",
                Real: "pending",
                Raju: "pending",
            },
            history: [
                {
                    date: "14 Oct 2026",
                    time: "10:30 PM",
                    user: "Rubel",
                    action: "completed",
                },
                {
                    date: "13 Oct 2026",
                    time: "08:15 AM",
                    user: "Radin",
                    action: "completed",
                },
            ],
        },
        {
            id: 2,
            title: "Vimbar kena",
            category: "Shopping Category",
            currentIndex: 4, // Raju
            completedCount: 3,
            totalCycle: 5,
            memberStates: {
                Radin: "completed",
                Rubel: "skipped",
                Arefin: "completed",
                Real: "completed",
                Raju: "pending",
            },
            history: [
                {
                    date: "14 Oct 2026",
                    time: "07:20 PM",
                    user: "Real",
                    action: "completed",
                },
                {
                    date: "12 Oct 2026",
                    time: "10:15 AM",
                    user: "Arefin",
                    action: "completed",
                },
                {
                    date: "11 Oct 2026",
                    time: "02:00 PM",
                    user: "Rubel",
                    action: "skipped",
                },
                {
                    date: "10 Oct 2026",
                    time: "08:00 AM",
                    user: "Radin",
                    action: "completed",
                },
            ],
        },
        {
            id: 3,
            title: "Washroom clean kora",
            category: "Cleaning Category",
            currentIndex: 2, // Arefin
            completedCount: 1,
            totalCycle: 5,
            memberStates: {
                Radin: "completed",
                Rubel: "pending",
                Arefin: "pending",
                Real: "pending",
                Raju: "pending",
            },
            history: [
                {
                    date: "14 Oct 2026",
                    time: "09:00 AM",
                    user: "Radin",
                    action: "completed",
                },
            ],
        },
    ]);

    const [activeTaskIndex, setActiveTaskIndex] = useState(0);

    const currentTask = tasksList[activeTaskIndex];
    const currentPerson = rotationMembers[currentTask.currentIndex];

    // Check if logged-in user owns the current turn
    const isMyTurn = currentPerson.name === loggedInUser;

    const showToastMsg = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2200);
    };

    const handleNextTask = () => {
        setActiveTaskIndex((prev) => (prev + 1) % tasksList.length);
    };

    const handlePrevTask = () => {
        setActiveTaskIndex(
            (prev) => (prev - 1 + tasksList.length) % tasksList.length,
        );
    };

    // Mark as Done & Rotate Turn with Dynamic Date & Time
    const handleDoneAndRotate = () => {
        if (!isMyTurn) {
            showToastMsg(
                `Access Denied! Only ${currentPerson.name} can complete this turn. ❌`,
            );
            return;
        }

        const previousPerson = currentPerson.name;
        const nextPersonIndex =
            (currentTask.currentIndex + 1) % rotationMembers.length;

        // Dynamic real-time date and time capture
        const { date: liveDate, time: liveTime } = getFormattedDateTime();

        const updatedTasks = [...tasksList];
        const targetTask = updatedTasks[activeTaskIndex];

        targetTask.currentIndex = nextPersonIndex;
        targetTask.completedCount = Math.min(
            targetTask.totalCycle,
            targetTask.completedCount + 1,
        );
        targetTask.memberStates[
            previousPerson as keyof typeof targetTask.memberStates
        ] = "completed";

        // Dynamic history log insertion
        targetTask.history.unshift({
            date: liveDate,
            time: liveTime,
            user: previousPerson,
            action: "completed",
        });

        setTasksList(updatedTasks);
        showToastMsg(
            `Task completed by ${previousPerson} at ${liveTime}! Dynamic history updated. 🎉`,
        );
    };

    // Skip Turn Handler with Dynamic Date & Time
    const handleSkipTurn = () => {
        if (!isMyTurn) {
            showToastMsg(
                `Access Denied! Only ${currentPerson.name} can skip their turn. ❌`,
            );
            return;
        }

        const currentP = currentPerson.name;
        const nextPersonIndex =
            (currentTask.currentIndex + 1) % rotationMembers.length;
        const nextPerson = rotationMembers[nextPersonIndex].name;

        // Dynamic real-time date and time capture
        const { date: liveDate, time: liveTime } = getFormattedDateTime();

        const updatedTasks = [...tasksList];
        const targetTask = updatedTasks[activeTaskIndex];

        targetTask.currentIndex = nextPersonIndex;
        targetTask.memberStates[
            currentP as keyof typeof targetTask.memberStates
        ] = "skipped";

        // Dynamic history log insertion
        targetTask.history.unshift({
            date: liveDate,
            time: liveTime,
            user: currentP,
            action: "skipped",
        });

        setTasksList(updatedTasks);
        showToastMsg(
            `Turn skipped by ${currentP} on ${liveDate}! Marked on avatar & assigned to ${nextPerson}. ⏭️`,
        );
    };

    const cyclePercentage = Math.round(
        (currentTask.completedCount / currentTask.totalCycle) * 100,
    );

    return (
        <main className="min-h-screen bg-slate-100 text-slate-900 pb-28 pt-4 px-4 font-sans relative">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-5 right-5 z-50 transition-all duration-300">
                    <div className="px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border bg-slate-900/95 border-slate-700 text-white text-xs font-bold">
                        <span>📢</span>
                        <span>{toast}</span>
                    </div>
                </div>
            )}

            <div className="max-w-md mx-auto space-y-4">
                {/* Top Header */}
                <div className="flex items-center justify-between py-1 px-1">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-xs text-sm font-bold active:scale-95 transition"
                        >
                            ←
                        </button>
                        <h1 className="text-base font-black text-slate-900">
                            Task Detail & History
                        </h1>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 shadow-xs">
                        Task {activeTaskIndex + 1} of {tasksList.length}
                    </span>
                </div>

                {/* Task Detail Card with Navigation Slider */}
                <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm text-center flex flex-col items-center space-y-4 relative">
                    <button
                        onClick={handlePrevTask}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition shadow-xs font-bold active:scale-95"
                    >
                        ‹
                    </button>

                    <button
                        onClick={handleNextTask}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition shadow-xs font-bold active:scale-95"
                    >
                        ›
                    </button>

                    <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-inner mt-1">
                        <span className="text-2xl">🧼</span>
                    </div>

                    <div>
                        <h2 className="text-lg font-black text-slate-900">
                            {currentTask.title}
                        </h2>
                        <p className="text-xs font-medium text-slate-400 mt-0.5">
                            {currentTask.category}
                        </p>
                    </div>

                    {/* Current Person In Charge Box */}
                    <div className="w-full bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex flex-col items-center justify-center">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
                            CURRENT PERSON IN CHARGE
                        </span>
                        <div className="flex items-center gap-2">
                            <img
                                src={currentPerson.avatar}
                                alt={currentPerson.name}
                                className="w-7 h-7 rounded-full object-cover border-2 border-blue-600 shadow-xs"
                            />
                            <span className="text-sm font-black text-slate-900">
                                {currentPerson.name}
                            </span>
                        </div>
                        {!isMyTurn && (
                            <span className="text-[10px] text-amber-700 font-extrabold mt-1.5 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80 flex items-center gap-1">
                                🔒 Locked (Only {currentPerson.name} can
                                complete)
                            </span>
                        )}
                    </div>

                    {/* Dynamic Cycle Progress Card UI */}
                    <div className="w-full bg-gradient-to-br from-slate-900 to-blue-950 text-white p-4 rounded-[24px] shadow-lg space-y-2 text-left relative overflow-hidden border border-slate-800">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-300 font-bold uppercase text-[10px] tracking-wider">
                                Cycle Rotation Progress
                            </span>
                            <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                                {currentTask.completedCount}/
                                {currentTask.totalCycle} ({cyclePercentage}%)
                            </span>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-500 shadow-sm"
                                style={{ width: `${cyclePercentage}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-0.5">
                            <span>5 Members Cycle Lock</span>
                            {currentTask.completedCount === 5 ? (
                                <span className="text-emerald-400 font-bold">
                                    ✓ Full Cycle Complete!
                                </span>
                            ) : (
                                <span className="text-amber-400 font-bold">
                                    ⚠️ Complete 5/5 to restart
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full space-y-2 pt-1">
                        <button
                            onClick={handleDoneAndRotate}
                            disabled={!isMyTurn}
                            className={`w-full py-3.5 font-extrabold text-xs rounded-2xl shadow-md transition ${
                                isMyTurn
                                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 active:scale-[0.98]"
                                    : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
                            }`}
                        >
                            {isMyTurn
                                ? "Mark as Done & Rotate Turn"
                                : `Locked (${currentPerson.name}'s Turn)`}
                        </button>
                        <button
                            onClick={handleSkipTurn}
                            disabled={!isMyTurn}
                            className={`w-full py-2.5 font-bold text-xs rounded-2xl border transition ${
                                isMyTurn
                                    ? "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 active:scale-[0.98]"
                                    : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                            }`}
                        >
                            Skip Turn (Record on History)
                        </button>
                    </div>
                </div>

                {/* Rotation Order Section Card */}
                <div className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Rotation Members
                        </h3>
                        <span className="text-[10px] text-slate-400 font-medium">
                            Badge status
                        </span>
                    </div>

                    <div className="flex items-center justify-between overflow-x-auto py-2 px-1">
                        {rotationMembers.map((member, index) => {
                            const isCurrent =
                                index === currentTask.currentIndex;
                            const status =
                                currentTask.memberStates[
                                    member.name as keyof typeof currentTask.memberStates
                                ];

                            return (
                                <div
                                    key={member.name}
                                    className="flex items-center gap-1.5 relative"
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="relative">
                                            <div
                                                className={`w-11 h-11 rounded-full overflow-hidden p-0.5 transition-all ${
                                                    isCurrent
                                                        ? "ring-3 ring-blue-600 scale-110 shadow-md"
                                                        : "opacity-80"
                                                }`}
                                            >
                                                <img
                                                    src={member.avatar}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            </div>

                                            {/* Status Badges: Tick for Completed, Skip for Skipped */}
                                            {status === "completed" && (
                                                <span
                                                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white shadow-xs"
                                                    title="Completed"
                                                >
                                                    ✓
                                                </span>
                                            )}
                                            {status === "skipped" && (
                                                <span
                                                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white shadow-xs"
                                                    title="Skipped"
                                                >
                                                    ⏭️
                                                </span>
                                            )}
                                        </div>

                                        <span
                                            className={`text-[10px] font-bold mt-1.5 ${isCurrent ? "text-blue-600" : "text-slate-600"}`}
                                        >
                                            {member.name}
                                        </span>
                                    </div>
                                    {index < rotationMembers.length - 1 && (
                                        <span className="text-slate-300 text-xs font-bold mb-4">
                                            ›
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Detailed Completion & Skip History Log (Dynamic Date & Time Display) */}
                <div className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Completion & Skip History
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400">
                            {currentTask.history.length} Logs
                        </span>
                    </div>

                    <div className="space-y-3 pt-1">
                        {currentTask.history.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 last:border-0"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className={`w-2.5 h-2.5 rounded-full ${
                                            item.action === "completed"
                                                ? "bg-emerald-500 ring-2 ring-emerald-100"
                                                : "bg-amber-500 ring-2 ring-amber-100"
                                        }`}
                                    />
                                    <div>
                                        <p className="font-bold text-slate-900">
                                            {item.user}{" "}
                                            <span
                                                className={`font-semibold ${item.action === "completed" ? "text-emerald-600" : "text-amber-600"}`}
                                            >
                                                {item.action === "completed"
                                                    ? "completed the task"
                                                    : "skipped turn"}
                                            </span>
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            {item.date} • {item.time}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                                        item.action === "completed"
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                            : "bg-amber-50 text-amber-700 border border-amber-100"
                                    }`}
                                >
                                    {item.action === "completed"
                                        ? "Done ✓"
                                        : "Skipped ⏭️"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <BottomNav />
        </main>
    );
}
