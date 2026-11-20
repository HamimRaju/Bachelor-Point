"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { completeTask, getTaskRotations, skipTask } from "@/actions/task.actions";
import { FLAT_MEMBERS } from "@/lib/members";
import { mergeTaskRotationViews } from "@/lib/task-view";
import type { TaskRotationView } from "@/lib/task-rotation";
import Image from "next/image";

export default function TaskDetailPage() {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);

  const params = useParams<{ id: string }>();
  const routeTaskId = params.id;
  const initialRouteTaskSelected = useRef(false);
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
        setTasksList((tasks) => mergeTaskRotationViews(tasks, result.tasks));
        if (!initialRouteTaskSelected.current) {
          const selectedIndex = result.tasks.findIndex(
            (task) => task.key === routeTaskId || task.id === routeTaskId,
          );
          setActiveTaskIndex(selectedIndex >= 0 ? selectedIndex : 0);
          initialRouteTaskSelected.current = true;
        }
        setLoadError(null);
      } catch (error) {
        if (!mounted) return;
        setLoadError(error instanceof Error ? error.message : "Unable to load tasks.");
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
  }, [routeTaskId]);

  const currentTask = tasksList[activeTaskIndex];
  const currentPerson = FLAT_MEMBERS.find(
    (member) => member.id === currentTask?.currentMemberId,
  ) ?? FLAT_MEMBERS[0];
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
      setActiveTaskIndex((index) => (index - 1 + tasksList.length) % tasksList.length);
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
          task.key === result.task.key && result.task.version >= task.version
            ? result.task
            : task,
        ),
      );
      showToastMsg(
        result.cycleCompleted
          ? `${currentTask.title} completed for everyone. A new cycle has started with Raju.`
          : action === "Completed"
            ? `${currentPerson.name} completed ${currentTask.title}.`
            : `${currentPerson.name}'s responsibility remains pending.`,
      );
    } catch (error) {
      try {
        const latest = await getTaskRotations();
        setMemberId(latest.memberId);
        setTasksList((tasks) => mergeTaskRotationViews(tasks, latest.tasks));
      } catch {
        // Keep the existing view if the refresh also fails.
      }
      showToastMsg(error instanceof Error ? error.message : "The task could not be updated.");
    } finally {
      setLoadingAction(null);
    }
  };

  if (!currentTask) {
    return (
      <main className="app-backdrop pb-12 pt-4 px-4 font-sans text-white">
        <div className="glass-surface mx-auto max-w-md rounded-2xl p-6 text-center text-sm text-[#131321]/60 shadow-none">
          {isLoading ? "Loading task rotations…" : loadError ?? "No tasks are available."}
        </div>
      </main>
    );
  }

  return (
    <main className="app-backdrop pb-12 pt-4 px-4 font-sans text-white">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 transition-all duration-300">
          <div className="px-4 py-3 rounded-2xl shadow-none flex items-center gap-2 border bg-[#FBE2B4] border-[#FBE2B4]/50 text-[#131321] text-xs font-bold">

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
              className="glass-surface w-9 h-9 rounded-full flex items-center justify-center text-[#131321]/75 shadow-none text-sm font-bold active:scale-95 transition"
            >
              ←
            </button>
            <h1 className="text-base font-black text-white">Task Detail</h1>
          </div>
          <span className="text-xs font-bold text-[#131321] bg-[#FBE2B4] px-3 py-1 rounded-full border border-[#FBE2B4]/30">
            Task {activeTaskIndex + 1} of {tasksList.length}
          </span>
        </div>

        {/* Task Detail Main Card with Slider Arrows */}
        <div className="glass-surface rounded-[32px] p-6 shadow-none text-center flex flex-col items-center space-y-4 relative">
          
          {/* Left & Right Slider Arrows */}
          <button 
            onClick={handlePrevTask}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#131321]/[0.04] border border-[#131321]/10 flex items-center justify-center text-[#131321]/65 hover:bg-[#131321]/5 transition shadow-none font-bold"
            title="Previous Task"
          >
            ‹
          </button>
          
          <button 
            onClick={handleNextTask}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#131321]/[0.04] border border-[#131321]/10 flex items-center justify-center text-[#131321]/65 hover:bg-[#131321]/5 transition shadow-none font-bold"
            title="Next Task"
          >
            ›
          </button>

          {/* Shopping Bag Blue Badge Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[#46F0D2]/20 flex items-center justify-center shadow-none mt-2">
            <svg className="w-8 h-8 text-[#131321]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h2 className="text-lg font-black text-[#131321]">{currentTask.title}</h2>
            <p className="text-xs font-medium text-[#131321]/55 mt-0.5">{currentTask.category} Category</p>
          </div>

          {/* Current Person In Charge Box */}
          <div className="w-full bg-gradient-to-br from-[#46F0D2]/20 to-[#8C8AFF]/15 rounded-2xl p-3.5 border border-[#46F0D2]/30 flex flex-col items-center justify-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#131321] mb-2">
              CURRENT PERSON IN CHARGE
            </span>
            <div className="flex items-center gap-2">
              <Image
                src={currentPerson.image}
                alt={currentPerson.name}
                width={28}
                height={28}
                className="w-7 h-7 rounded-full object-cover border-2 border-[#46F0D2]"
              />
              <span className="text-sm font-black text-[#131321]">{currentPerson.name}</span>
            </div>
          </div>

          {/* Action Buttons: Done & Rotate + Skip */}
          <div className="w-full space-y-2 pt-1">
            <button
              onClick={() => void handleTaskAction("Completed")}
              disabled={!isMyTurn || loadingAction !== null}
              className="w-full py-3.5 bg-[#46F0D2] text-[#131321] font-extrabold text-xs rounded-2xl transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loadingAction === "Completed"
                ? "Updating..."
                : isMyTurn
                  ? "Mark as Done & Rotate Turn"
                  : `Locked (${currentPerson.name}'s Turn)`}
            </button>
            <button
              onClick={() => void handleTaskAction("Skipped")}
              disabled={!isMyTurn || loadingAction !== null}
              className="w-full py-2.5 bg-[#131321]/5 hover:bg-[#131321]/10 text-[#131321]/75 font-bold text-xs rounded-2xl border border-[#131321]/10 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loadingAction === "Skipped" ? "Updating..." : "Skip Turn"}
            </button>
          </div>

        </div>

        {/* Rotation Order Section Card with Tick Mark on Completed Members */}
        <div className="glass-surface rounded-[28px] p-5 shadow-none space-y-3">
          <h3 className="text-xs font-bold text-[#131321] uppercase tracking-wider">Rotation Order</h3>
          
          <div className="flex items-center justify-between overflow-x-auto py-2 px-1">
            {currentTask.responsibilities.map((responsibility, index) => {
              const member = FLAT_MEMBERS[index];
              const isCurrent = member.id === currentTask.currentMemberId;

              return (
                <div key={member.name} className="flex items-center gap-1.5 relative">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full overflow-hidden p-0.5 transition-all ${
                        isCurrent ? "ring-2 ring-[#46F0D2] scale-110 shadow-none" : "opacity-75"
                      }`}>
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      {/* Tick Mark Badge on Avatar */}
                      {responsibility.status === "Completed" && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#46F0D2] text-[#131321] text-[9px] font-black rounded-full flex items-center justify-center border border-white shadow-none">
                          ✓
                        </span>
                      )}
                      {responsibility.status === "Skipped" && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#FBE2B4] text-[#131321] text-[8px] font-black rounded-full flex items-center justify-center border border-white shadow-none">
                          Skip
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold mt-1.5 ${isCurrent ? "text-[#131321]" : "text-[#131321]/60"}`}>
                      {member.name}
                    </span>
                  </div>
                  {index < currentTask.responsibilities.length - 1 && (
                    <span className="text-[#131321]/45 text-xs font-bold mb-4">›</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion History Section Card */}
        <div className="glass-surface rounded-[28px] p-5 shadow-none space-y-3">
          <h3 className="text-xs font-bold text-[#131321] uppercase tracking-wider">Completion History</h3>
          
          <div className="space-y-2">
            {currentTask.history.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-[#131321]/10 last:border-0 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.action === "Completed" ? "bg-[#46F0D2]" : "bg-[#FBE2B4]"}`} />
                  <span className="font-semibold text-[#131321]/75">
                    <strong className="text-[#131321]">{item.name}</strong>{" "}
                    {item.action === "Completed" ? "completed" : "skipped"}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-[#131321]/55">{new Date(item.occurredAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
