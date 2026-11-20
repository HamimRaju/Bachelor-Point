"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { completeTask, getTaskRotations, skipTask } from "@/actions/task.actions";
import { FLAT_MEMBERS } from "@/lib/members";
import { mergeTaskRotationViews } from "@/lib/task-view";
import type { TaskRotationView } from "@/lib/task-rotation";
import {
  PageFrame,
  Pill,
  SectionHeading,
  SurfaceCard,
} from "@/components/ui";
import {
  banglaError,
  formatBnNumber,
  translateMemberName,
  translateTaskCategory,
  translateTaskTitle,
} from "@/lib/bn";

type TaskFilter = "All" | "My Turn" | "Completed";
const filters: TaskFilter[] = ["All", "My Turn", "Completed"];
const filterLabels: Record<TaskFilter, string> = {
  All: "সব কাজ",
  "My Turn": "আমার পালা",
  Completed: "সম্পন্ন",
};
const filterTitles: Record<TaskFilter, string> = {
  All: "সব কাজ",
  "My Turn": "আমার পালার কাজ",
  Completed: "সম্পন্ন কাজ",
};

export default function TasksPage() {
  const [filter, setFilter] = useState<TaskFilter>("All");
  const [toast, setToast] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskRotationView[]>([]);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingTaskKey, setLoadingTaskKey] = useState<string | null>(null);
  const actionInProgress = useRef(false);

  useEffect(() => {
    let mounted = true;
    const loadTasks = async () => {
      try {
        const result = await getTaskRotations();
        if (!mounted) return;
        setMemberId(result.memberId);
        setTasks((current) => mergeTaskRotationViews(current, result.tasks));
        setLoadError(null);
      } catch (error) {
        if (mounted) setLoadError(banglaError(error, "কাজের তালিকা লোড করা যায়নি।"));
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

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  };

  const handleTaskAction = async (task: TaskRotationView, action: "Completed" | "Skipped") => {
    if (actionInProgress.current) {
      showToast("একটি কাজের তথ্য সংরক্ষণ হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।");
      return;
    }
    if (task.currentMemberId !== memberId) {
      try {
        const latest = await getTaskRotations();
        setMemberId(latest.memberId);
        setTasks((current) => mergeTaskRotationViews(current, latest.tasks));
        showToast("কাজের পালা বদলে গেছে। তালিকাটি হালনাগাদ করা হয়েছে।");
      } catch (error) {
        showToast(banglaError(error, "কাজের তালিকা হালনাগাদ করা যায়নি।"));
      }
      return;
    }
    actionInProgress.current = true;
    setLoadingTaskKey(task.key);
    try {
      const result = action === "Completed"
        ? await completeTask(task.key, task.cycleId)
        : await skipTask(task.key, task.cycleId);
      setTasks((current) => current.map((item) =>
        item.key === task.key && result.task.version >= item.version ? result.task : item,
      ));
      showToast(result.cycleCompleted
        ? `${translateTaskTitle(task.key, task.title)} সবার জন্য সম্পন্ন হয়েছে। নতুন পালা শুরু হয়েছে।`
        : action === "Completed"
          ? `${translateTaskTitle(task.key, task.title)} সম্পন্ন হয়েছে।`
          : `${translateTaskTitle(task.key, task.title)}-এর পালা এখনো বাকি আছে।`);
    } catch (error) {
      try {
        const latest = await getTaskRotations();
        setMemberId(latest.memberId);
        setTasks((current) => mergeTaskRotationViews(current, latest.tasks));
      } catch {
        // Keep the current list if refresh is unavailable.
      }
      showToast(banglaError(error, "কাজটি হালনাগাদ করা যায়নি।"));
    } finally {
      actionInProgress.current = false;
      setLoadingTaskKey(null);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const myStatus = task.responsibilities.find((item) => item.memberId === memberId)?.status;
    if (filter === "My Turn") return task.currentMemberId === memberId;
    if (filter === "Completed") return myStatus === "Completed";
    return true;
  });

  return (
    <PageFrame className="palette-page">
      {toast && <div role="status" className="fixed left-1/2 top-4 z-50 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full bg-[#FBE2B4] px-4 py-2.5 text-center text-xs font-bold text-[#131321] shadow-none">{toast}</div>}

      <header>
          <p className="text-xs font-semibold text-[#46F0D2]">Bachelor Point · ফ্ল্যাট ৩বি</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">কাজের তালিকা</h1>
          <p className="mt-1 text-sm text-white/65">সবার জন্য সমান কাজের পালা।</p>
      </header>

      <div role="tablist" aria-label="কাজ বাছাই করুন" className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filters.map((item) => (
          <button key={item} type="button" role="tab" aria-selected={filter === item} onClick={() => setFilter(item)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors ${filter === item ? "bg-[#46F0D2] text-[#131321]" : "border border-white/20 bg-white/10 text-white/70"}`}>
            {filterLabels[item]}
          </button>
        ))}
        <Link href="/tasks/detail" className="ml-auto inline-flex shrink-0 items-center px-2 py-2 text-xs font-semibold text-white/70">কাজের ইতিহাস <span aria-hidden="true" className="ml-1">›</span></Link>
      </div>

      <section className="space-y-3">
        <SectionHeading title={filterTitles[filter]} subtitle={`${formatBnNumber(filteredTasks.length)}টি কাজ`} />
        {isLoading && tasks.length === 0 ? (
          <SurfaceCard className="p-5 text-sm text-white/70">কাজের পালা লোড হচ্ছে…</SurfaceCard>
        ) : loadError && tasks.length === 0 ? (
          <SurfaceCard className="p-5 text-sm font-medium">{loadError}</SurfaceCard>
        ) : filteredTasks.length === 0 ? (
          <SurfaceCard className="p-6 text-center">
            <p className="text-sm font-bold">দেখানোর মতো কিছু নেই</p>
            <p className="mt-1 text-xs text-white/60">পালা বদলালে আপনার কাজের তালিকা হালনাগাদ হবে।</p>
          </SurfaceCard>
        ) : (
          <SurfaceCard className="divide-y divide-white/10 px-4">
            {filteredTasks.map((task) => {
              const member = FLAT_MEMBERS.find((flatmate) => flatmate.id === task.currentMemberId);
              const myStatus = task.responsibilities.find((item) => item.memberId === memberId)?.status;
              const isMyTurn = task.currentMemberId === memberId;
              const isDone = myStatus === "Completed";
              return (
                <div key={task.id} className="flex items-center gap-3 py-3.5">
                  <div className="min-w-0 flex-1">
                    <Link href={`/tasks/${task.key}`} className="text-sm font-bold">{translateTaskTitle(task.key, task.title)}</Link>
                    <p className="mt-1 text-xs text-white/60">{translateTaskCategory(task.category)} · {formatBnNumber(task.completedCount)}/৫টি পালা সম্পন্ন</p>
                    <Pill tone="gold" className="mt-2">{member ? translateMemberName(member.name) : "বরাদ্দ নেই"}{isMyTurn ? " · আপনি" : ""}</Pill>
                  </div>
                  {isDone ? (
                    <span className="text-xs font-semibold text-white/65">সম্পন্ন ✓</span>
                  ) : isMyTurn ? (
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <button type="button" onClick={() => void handleTaskAction(task, "Completed")} disabled={loadingTaskKey !== null} className="rounded-full bg-[#46F0D2] px-3.5 py-2 text-xs font-bold text-[#131321] disabled:cursor-not-allowed disabled:opacity-60">
                        {loadingTaskKey === task.key ? "সংরক্ষণ হচ্ছে…" : "সম্পন্ন"}
                      </button>
                      <button type="button" onClick={() => void handleTaskAction(task, "Skipped")} disabled={loadingTaskKey !== null} className="text-[11px] text-white/70 underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50">এড়িয়ে যান</button>
                    </div>
                  ) : <span className="text-xs text-white/60">পালার অপেক্ষায়</span>}
                </div>
              );
            })}
          </SurfaceCard>
        )}
      </section>
    </PageFrame>
  );
}
