"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { completeTask, getTaskRotations, skipTask } from "@/actions/task.actions";
import { FLAT_MEMBERS } from "@/lib/members";
import { mergeTaskRotationViews } from "@/lib/task-view";
import type { TaskRotationView } from "@/lib/task-rotation";
import {
    banglaError,
    formatBnDateTime,
    formatBnNumber,
    translateMemberName,
    translateTaskCategory,
    translateTaskTitle,
} from "@/lib/bn";

export default function TaskDetailPage() {
    const router = useRouter();
    const [toast, setToast] = useState<string | null>(null);

    const [memberId, setMemberId] = useState<string | null>(null);
    const [tasksList, setTasksList] = useState<TaskRotationView[]>([]);
    const [activeTaskIndex, setActiveTaskIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [loadingAction, setLoadingAction] = useState<"Completed" | "Skipped" | null>(null);

    useEffect(() => {
        let mounted = true;

        const loadTasks = async () => {
            try {
                const result = await getTaskRotations();
                if (!mounted) return;
                setMemberId(result.memberId);
                setTasksList((tasks) =>
                    mergeTaskRotationViews(tasks, result.tasks),
                );
                setLoadError(null);
            } catch (error) {
                if (!mounted) return;
                setLoadError(
                    banglaError(error, "কাজের তালিকা লোড করা যায়নি।"),
                );
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        void loadTasks();
        const interval = window.setInterval(() => {
            if (document.visibilityState === "visible") void loadTasks();
        }, 30_000);
        window.addEventListener("focus", loadTasks);

        return () => {
            mounted = false;
            window.clearInterval(interval);
            window.removeEventListener("focus", loadTasks);
        };
    }, []);

    const currentTask = tasksList[activeTaskIndex];
    const currentMember = FLAT_MEMBERS.find(
        (member) => member.id === currentTask?.currentMemberId,
    ) ?? FLAT_MEMBERS[0];
    const currentPerson = currentMember;
    const isMyTurn = currentTask?.currentMemberId === memberId;

    const showToastMsg = (message: string) => {
        setToast(message);
        window.setTimeout(() => setToast(null), 2500);
    };

    const handleNextTask = () => {
        if (tasksList.length > 0) {
            setActiveTaskIndex((index) => (index + 1) % tasksList.length);
        }
    };

    const handlePrevTask = () => {
        if (tasksList.length > 0) {
            setActiveTaskIndex(
                (index) => (index - 1 + tasksList.length) % tasksList.length,
            );
        }
    };

    const handleTaskAction = async (action: "Completed" | "Skipped") => {
        if (!currentTask || !isMyTurn || loadingAction) return;

        setLoadingAction(action);
        try {
            const result =
                action === "Completed"
                    ? await completeTask(currentTask.key, currentTask.cycleId)
                    : await skipTask(currentTask.key, currentTask.cycleId);

            setTasksList((tasks) =>
                tasks.map((task) =>
                    task.key === result.task.key &&
                    result.task.version >= task.version
                        ? result.task
                        : task,
                ),
            );
            showToastMsg(
                result.cycleCompleted
                    ? `${translateTaskTitle(currentTask.key, currentTask.title)} সবার জন্য সম্পন্ন হয়েছে। রাজুকে নিয়ে নতুন পালা শুরু হয়েছে।`
                    : action === "Completed"
                      ? `${translateMemberName(currentMember.name)} ${translateTaskTitle(currentTask.key, currentTask.title)} সম্পন্ন করেছেন।`
                      : `${translateMemberName(currentMember.name)}-এর কাজটি বাকি রয়েছে এবং তার পালা শেষে সরানো হয়েছে।`,
            );
        } catch (error) {
            try {
                const latest = await getTaskRotations();
                setMemberId(latest.memberId);
                setTasksList((tasks) =>
                    mergeTaskRotationViews(tasks, latest.tasks),
                );
            } catch {
                // Keep the existing view if the refresh also fails.
            }
            showToastMsg(
                banglaError(error, "কাজটি হালনাগাদ করা যায়নি।"),
            );
        } finally {
            setLoadingAction(null);
        }
    };

    const cyclePercentage = currentTask
        ? Math.round(
              (currentTask.completedCount / currentTask.responsibilities.length) * 100,
          )
        : 0;

    if (!currentTask) {
        return (
            <main className="app-backdrop px-3 pb-28 pt-4 font-sans text-white sm:px-4">
                <div className="glass-surface mx-auto max-w-md rounded-2xl p-6 text-center text-sm text-[#131321]/60 shadow-none">
                    {isLoading ? "কাজের পালা লোড হচ্ছে…" : loadError ?? "এখনো কোনো কাজ যোগ করা হয়নি।"}
                </div>
            </main>
        );
    }

    return (
        <main className="app-backdrop relative px-3 pb-28 pt-4 font-sans text-white sm:px-4">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-5 right-5 z-50 transition-all duration-300">
                    <div className="px-4 py-3 rounded-2xl shadow-none flex items-center gap-2 border bg-[#FBE2B4] border-[#FBE2B4]/30 text-[#131321] text-xs font-bold">
                        <span>{toast}</span>
                    </div>
                </div>
            )}

            <div className="max-w-md mx-auto space-y-4">
                {/* Top Header */}
                <div className="flex items-center justify-between py-1 px-1">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="কাজের তালিকায় ফিরে যান"
                            onClick={() => router.push("/tasks")}
                            className="glass-surface w-9 h-9 rounded-full flex items-center justify-center text-[#131321]/75 shadow-none text-sm font-bold active:scale-95 transition"
                        >
                            ←
                        </button>
                        <h1 className="text-base font-black text-white">
                            কাজের বিস্তারিত ও ইতিহাস
                        </h1>
                    </div>
                    <span className="text-xs font-bold text-[#131321] bg-[#FBE2B4] px-3 py-1 rounded-full border border-[#FBE2B4]/30 shadow-none">
                        {formatBnNumber(activeTaskIndex + 1)} / {formatBnNumber(tasksList.length)}টি কাজ
                    </span>
                </div>

                {/* Task Detail Card with Navigation Slider */}
                <div className="glass-surface relative flex flex-col items-center space-y-4 rounded-[32px] p-4 text-center shadow-none sm:p-6">
                    <button
                        type="button"
                        aria-label="আগের কাজ"
                        onClick={handlePrevTask}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#131321]/[0.04] border border-[#131321]/10 flex items-center justify-center text-[#131321]/65 hover:bg-[#131321]/5 transition shadow-none font-bold active:scale-95"
                    >
                        ‹
                    </button>

                    <button
                        type="button"
                        aria-label="পরের কাজ"
                        onClick={handleNextTask}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#131321]/[0.04] border border-[#131321]/10 flex items-center justify-center text-[#131321]/65 hover:bg-[#131321]/5 transition shadow-none font-bold active:scale-95"
                    >
                        ›
                    </button>

                    <div className="w-16 h-16 rounded-2xl bg-[#46F0D2]/15 border border-[#46F0D2]/25 flex items-center justify-center shadow-none mt-1">
                        <span className="text-2xl">T</span>
                    </div>

                    <div>
                        <h2 className="text-lg font-black text-[#131321]">
                            {translateTaskTitle(currentTask.key, currentTask.title)}
                        </h2>
                        <p className="text-xs font-medium text-[#131321]/55 mt-0.5">
                            {translateTaskCategory(currentTask.category)}
                        </p>
                    </div>

                    {/* Current Person In Charge Box */}
                    <div className="w-full bg-[#131321]/[0.04] rounded-2xl p-3.5 border border-[#131321]/10 flex flex-col items-center justify-center">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#131321]/55 mb-1.5">
                            বর্তমানে দায়িত্বে আছেন
                        </span>
                        <div className="flex items-center gap-2">
                            <Image
                                src={currentMember.image}
                                alt={translateMemberName(currentPerson.name)}
                                width={28}
                                height={28}
                                className="w-7 h-7 rounded-full object-cover border-2 border-[#46F0D2] shadow-none"
                            />
                            <span className="text-sm font-black text-[#131321]">
                                {translateMemberName(currentPerson.name)}
                            </span>
                        </div>
                        {!isMyTurn && (
                            <span className="text-[10px] text-[#131321] font-extrabold mt-1.5 bg-[#FBE2B4]/45 px-2.5 py-0.5 rounded-full border border-[#FBE2B4]/80 flex items-center gap-1">
                                শুধু {translateMemberName(currentPerson.name)} কাজটি সম্পন্ন করতে পারবেন
                            </span>
                        )}
                    </div>

                    {/* Dynamic Cycle Progress Card UI */}
                    <div className="gradient-panel w-full text-white p-4 rounded-[24px] shadow-none space-y-2 text-left relative overflow-hidden border border-white/10">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-white/65 font-bold uppercase text-[10px] tracking-wider">
                                পালার অগ্রগতি
                            </span>
                            <span className="text-xs font-black text-[#131321] bg-[#46F0D2] px-2.5 py-0.5 rounded-full border border-[#46F0D2]/30">
                                {formatBnNumber(currentTask.completedCount)}/
                                {formatBnNumber(currentTask.responsibilities.length)} ({formatBnNumber(cyclePercentage)}%)
                            </span>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
                            <div
                                className="h-full rounded-full bg-[#46F0D2] transition-all duration-500 shadow-none"
                                style={{ width: `${cyclePercentage}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-white/65 font-medium pt-0.5">
                            <span>৫ সদস্যের পালা</span>
                            {currentTask.completedCount === currentTask.responsibilities.length ? (
                                <span className="text-[#46F0D2] font-bold">
                                    ✓ পুরো পালা সম্পন্ন!
                                </span>
                            ) : (
                                <span className="text-[#FBE2B4] font-bold">
                                    নতুন পালার জন্য ৫/৫টি সম্পন্ন করুন
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full space-y-2 pt-1">
                        <button
                            onClick={() => void handleTaskAction("Completed")}
                            disabled={!isMyTurn || loadingAction !== null}
                            className={`w-full py-3.5 font-extrabold text-xs rounded-2xl shadow-none transition ${
                                isMyTurn
                                    ? "bg-[#46F0D2] text-[#131321] active:scale-[0.98]"
                                    : "bg-[#131321]/5 text-[#131321]/55 border border-[#131321]/10 cursor-not-allowed shadow-none"
                            }`}
                        >
                            {loadingAction === "Completed"
                                ? "হালনাগাদ হচ্ছে…"
                                : isMyTurn
                                ? "সম্পন্ন চিহ্নিত করে পালা দিন"
                                : `শুধু ${translateMemberName(currentPerson.name)}-এর পালা`}
                        </button>
                        <button
                            onClick={() => void handleTaskAction("Skipped")}
                            disabled={!isMyTurn || loadingAction !== null}
                            className={`w-full py-2.5 font-bold text-xs rounded-2xl border transition ${
                                isMyTurn
                                    ? "bg-[#131321]/[0.04] hover:bg-[#131321]/5 text-[#131321]/75 border-[#131321]/10 active:scale-[0.98]"
                                    : "bg-[#131321]/[0.04] text-[#131321]/45 border-[#131321]/10 cursor-not-allowed"
                            }`}
                        >
                            {loadingAction === "Skipped" ? "হালনাগাদ হচ্ছে…" : "পালা এড়িয়ে যান (ইতিহাসে থাকবে)"}
                        </button>
                    </div>
                </div>

                {/* Rotation Order Section Card */}
                <div className="glass-surface space-y-3 rounded-[28px] p-4 shadow-none sm:p-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-[#131321] uppercase tracking-wider">
                            পালার সদস্যরা
                        </h3>
                        <span className="text-[10px] text-[#131321]/55 font-medium">
                            অবস্থা
                        </span>
                    </div>

                    <div className="flex items-center justify-between overflow-x-auto py-2 px-1">
                        {currentTask.responsibilities.map((responsibility, index) => {
                            const member = FLAT_MEMBERS[index];
                            const isCurrent =
                                member.id === currentTask.currentMemberId;
                            const status = responsibility.status.toLowerCase();

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
                                                        ? "ring-3 ring-[#46F0D2] scale-110 shadow-none"
                                                        : "opacity-80"
                                                }`}
                                            >
                                                <Image
                                                    src={member.image}
                                                    alt={translateMemberName(member.name)}
                                                    width={44}
                                                    height={44}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            </div>

                                            {/* Status Badges: Tick for Completed, Skip for Skipped */}
                                            {status === "completed" && (
                                                <span
                                                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#46F0D2] text-[#131321] text-[9px] font-black rounded-full flex items-center justify-center border border-white shadow-none"
                                                    title="সম্পন্ন"
                                                >
                                                    ✓
                                                </span>
                                            )}
                                            {status === "skipped" && (
                                                <span
                                                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#FBE2B4] text-[#131321] text-[8px] font-black rounded-full flex items-center justify-center border border-white shadow-none"
                                                    title="এড়িয়ে যাওয়া"
                                                >
                                                    বাদ
                                                </span>
                                            )}
                                        </div>

                                        <span
                                            className={`text-[10px] font-bold mt-1.5 ${isCurrent ? "text-[#131321]" : "text-[#131321]/65"}`}
                                        >
                                            {translateMemberName(member.name)}
                                        </span>
                                    </div>
                                    {index < currentTask.responsibilities.length - 1 && (
                                        <span className="text-[#131321]/45 text-xs font-bold mb-4">
                                            ›
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Detailed Completion & Skip History Log (Dynamic Date & Time Display) */}
                <div className="glass-surface space-y-3 rounded-[28px] p-4 shadow-none sm:p-5">
                    <div className="flex items-center justify-between border-b border-[#131321]/10 pb-2">
                        <h3 className="text-xs font-bold text-[#131321] uppercase tracking-wider">
                            সম্পন্ন ও এড়িয়ে যাওয়ার ইতিহাস
                        </h3>
                        <span className="text-[10px] font-bold text-[#131321]/55">
                            {formatBnNumber(currentTask.history.length)}টি নথি
                        </span>
                    </div>

                    <div className="space-y-3 pt-1">
                        {currentTask.history.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between text-xs py-1.5 border-b border-[#131321]/10 last:border-0"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className={`w-2.5 h-2.5 rounded-full ${
                                            item.action === "Completed"
                                                ? "bg-[#46F0D2] ring-2 ring-[#46F0D2]/30"
                                                : "bg-[#FBE2B4] ring-2 ring-[#FBE2B4]/35"
                                        }`}
                                    />
                                    <div>
                                        <p className="font-bold text-[#131321]">
                                            {translateMemberName(item.name)}{" "}
                                            <span
                                                className={`font-semibold ${item.action === "Completed" ? "text-[#131321]" : "text-[#131321]"}`}
                                            >
                                                {item.action === "Completed"
                                                    ? "কাজটি সম্পন্ন করেছেন"
                                                    : "পালা এড়িয়ে গেছেন"}
                                            </span>
                                        </p>
                                        <p className="text-[10px] text-[#131321]/55 font-medium">
                                            {formatBnDateTime(item.occurredAt)}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                                        item.action === "Completed"
                                            ? "bg-[#46F0D2]/20 text-[#131321] border border-[#46F0D2]/20"
                                            : "bg-[#FBE2B4]/45 text-[#131321] border border-[#FBE2B4]/30"
                                    }`}
                                >
                                    {item.action === "Completed"
                                        ? "সম্পন্ন ✓"
                                        : "এড়িয়ে গেছেন"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </main>
    );
}
