"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { completeTask, getTaskRotations } from "@/actions/task.actions";
import { PageFrame, SurfaceCard } from "@/components/ui";
import BrandLogo from "@/components/BrandLogo";
import OutstandingExpenseSummary from "@/components/OutstandingExpenseSummary";
import { FLAT_MEMBERS } from "@/lib/members";
import { mergeTaskRotationViews } from "@/lib/task-view";
import type { TaskRotationView } from "@/lib/task-rotation";
import { authClient } from "@/lib/auth-client";
import type { ExpenseView } from "@/lib/expense-view";
import {
  banglaError,
  formatBnNumber,
  translateMemberName,
  translateTaskTitle,
} from "@/lib/bn";

const taskColors = ["mint", "teal", "gold", "mint", "gold"] as const;

function BellIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const sessionMember = FLAT_MEMBERS.find(
    (member) => member.email === session?.user?.email?.toLowerCase(),
  );
  const [resolvedMemberId, setResolvedMemberId] = useState<string | null>(null);
  const currentMemberId = sessionMember?.id ?? resolvedMemberId;
  const currentMember = FLAT_MEMBERS.find(
    (member) => member.id === currentMemberId,
  );
  const userName = currentMember?.name ?? session?.user?.name ?? "সদস্য";
  const userImage = currentMember?.image ?? session?.user?.image ?? "/Raju.jpg";
  const [tasks, setTasks] = useState<TaskRotationView[]>([]);
  const [loadingTaskKey, setLoadingTaskKey] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [hasLoadedTasks, setHasLoadedTasks] = useState(false);
  const [sharedExpensesTotal, setSharedExpensesTotal] = useState<number | null>(
    null,
  );

  const updateSharedExpensesTotal = useCallback((expenses: ExpenseView[]) => {
    setSharedExpensesTotal(
      expenses.reduce((total, expense) => total + expense.totalAmount, 0),
    );
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadTasks = async () => {
      try {
        const result = await getTaskRotations();
        if (!mounted) return;
        setResolvedMemberId(result.memberId);
        setTasks((current) => mergeTaskRotationViews(current, result.tasks));
      } catch {
        // Keep the dashboard usable if a refresh temporarily fails.
      } finally {
        if (mounted) setHasLoadedTasks(true);
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

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2400);
  };

  const completeMyTurn = async (task: TaskRotationView) => {
    if (!currentMemberId || task.currentMemberId !== currentMemberId || loadingTaskKey) return;
    setLoadingTaskKey(task.key);
    try {
      const result = await completeTask(task.key, task.cycleId);
      setTasks((current) => current.map((item) =>
        item.key === task.key && result.task.version >= item.version ? result.task : item,
      ));
      showNotice(`${translateTaskTitle(task.key, task.title)} সম্পন্ন হয়েছে।`);
    } catch (error) {
      showNotice(banglaError(error, "কাজটি হালনাগাদ করা যায়নি।"));
    } finally {
      setLoadingTaskKey(null);
    }
  };

  const completedCount = tasks.reduce((sum, task) => sum + task.completedCount, 0);
  const totalTurns = tasks.length * FLAT_MEMBERS.length;
  const progress = totalTurns ? Math.round((completedCount / totalTurns) * 100) : 0;
  const myTurnTasks = tasks.filter((task) => task.currentMemberId === currentMemberId);
  const ringProgress = `conic-gradient(from -90deg, #69e9c6 0%, #64d8d8 ${Math.max(progress - 12, 0)}%, #f6cb6f ${progress}%, rgb(255 255 255 / 12%) ${progress}% 100%)`;

  return (
    <PageFrame className="home-dashboard">
      {notice && (
        <div
          role="status"
          className="home-toast fixed left-1/2 top-4 z-[60] -translate-x-1/2 rounded-full px-4 py-2.5 text-center text-xs font-bold"
        >
          {notice}
        </div>
      )}

      <header className="home-member-header">
        <div className="flex min-w-0 items-center gap-3">
          <div className="home-avatar">
            <Image
              src={userImage}
               alt={translateMemberName(userName)}
              width={48}
              height={48}
              unoptimized={userImage.startsWith("http")}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="min-w-0">
            <h1 className="flex items-center gap-1.5 truncate text-base font-bold tracking-tight">
              {translateMemberName(userName)}
              <span aria-label="ফ্ল্যাটের সদস্য" title="ফ্ল্যাটের সদস্য" className="text-amber-300">★</span>
            </h1>
            <p className="truncate text-xs text-white/60">ফ্ল্যাটের সদস্য · ব্লক বি, বাড়ি ১৬</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="বিজ্ঞপ্তি"
          onClick={() => showNotice("নতুন কোনো বিজ্ঞপ্তি নেই।")}
          className="home-notification-button"
        >
          <BellIcon />
        </button>
      </header>

      <div className="home-hero-stack">
        <div className="home-hero-stack-back" aria-hidden="true" />
        <div className="home-hero-stack-middle" aria-hidden="true" />
          <SurfaceCard className="home-hero-card p-4 sm:p-6">
          <BrandLogo className="home-brand-lockup" />
          <h2 className="home-hero-heading mt-4 max-w-sm font-extrabold tracking-tight">
            একসাথে গুছিয়ে চলি, ভালো থাকি।
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/15 pt-4">
            <div>
              <p className="text-xl font-extrabold tracking-tight sm:text-2xl">{formatBnNumber(FLAT_MEMBERS.length)} জন সক্রিয়</p>
              <p className="mt-0.5 text-xs text-white/65">সদস্য</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-extrabold tracking-tight sm:text-2xl">
                {sharedExpensesTotal === null
                  ? "লোড হচ্ছে…"
                  : `৳${formatBnNumber(sharedExpensesTotal)}`}
              </p>
              <p className="mt-0.5 text-xs text-white/65">
                নথিভুক্ত মোট খরচ
              </p>
            </div>
          </div>
        </SurfaceCard>
      </div>

        <section className="home-summary-grid" aria-label="কাজের সারসংক্ষেপ">
        <SurfaceCard className="home-progress-card p-4">
          <h2 className="home-card-eyebrow">আজকের পালাক্রমের কাজ</h2>
          <div
            className="home-progress-ring"
            role="img"
            aria-label={`${formatBnNumber(totalTurns)}টির মধ্যে ${formatBnNumber(completedCount)}টি কাজ সম্পন্ন`}
            style={{ background: ringProgress }}
          >
            <div className="home-progress-ring-inner">
              <strong>{totalTurns ? `${formatBnNumber(completedCount)}/${formatBnNumber(totalTurns)}` : "—"}</strong>
              <span>সম্পন্ন<br />কাজ</span>
            </div>
          </div>
          <p className="mt-3 text-center text-[11px] text-white/55">এই পালায় {formatBnNumber(progress)}%</p>
        </SurfaceCard>

        <div className="home-summary-stack">
          <Link href="/tasks" className="home-summary-action home-view-action">
            <span>বিস্তারিত দেখুন <span aria-hidden="true">›</span></span>
            <span className="home-action-subtitle">পালাক্রমের সব কাজ দেখুন</span>
          </Link>
          <Link href="/tasks" className="home-summary-action home-turn-action">
            <span className="home-card-eyebrow">আজ আপনার পালা</span>
            <strong>{hasLoadedTasks ? `${formatBnNumber(myTurnTasks.length)}টি কাজ` : "লোড হচ্ছে…"}</strong>
            <span className="home-action-subtitle">
              {myTurnTasks.length === 1 ? "একটি কাজ বাকি আছে" : "আপনার জন্য বরাদ্দ করা কাজ"}
            </span>
          </Link>
        </div>
      </section>

      <SurfaceCard className="home-rotation-card p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="home-card-eyebrow">আজকের কাজের পালা</h2>
            <p className="mt-1 text-xs text-white/55">সবার জন্য সমান কাজের পালা</p>
          </div>
          <Link href="/tasks" className="home-text-link">সব কাজ <span aria-hidden="true">›</span></Link>
        </div>

        {tasks.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-4 text-sm text-white/65">
            {hasLoadedTasks ? "এখনো কোনো পালাক্রমের কাজ যোগ করা হয়নি।" : "কাজের তালিকা লোড হচ্ছে…"}
          </p>
        ) : (
          <div className="home-rotation-grid">
            {tasks.slice(0, 5).map((task, index) => {
              const assignedMember = FLAT_MEMBERS.find(
                (member) => member.id === task.currentMemberId,
              );
              const myResponsibility = task.responsibilities.find(
                (item) => item.memberId === currentMemberId,
              );
              const isMyTurn = task.currentMemberId === currentMemberId;
              const isDone = myResponsibility?.status === "Completed";

              return (
                <div
                  key={task.id}
                  className={`home-rotation-tile home-rotation-${taskColors[index % taskColors.length]}`}
                >
                  {isMyTurn && !isDone ? (
                    <button
                      type="button"
                      onClick={() => void completeMyTurn(task)}
                      disabled={loadingTaskKey === task.key}
                      aria-label={`${translateTaskTitle(task.key, task.title)} সম্পন্ন করুন`}
                      className="home-task-check"
                    >
                      {loadingTaskKey === task.key ? "…" : "✓"}
                    </button>
                  ) : (
                    <span
                      aria-label={isDone ? "সম্পন্ন" : "অপেক্ষায়"}
                      className={`home-task-check ${isDone ? "is-complete" : "is-waiting"}`}
                    >
                      {isDone ? "✓" : "·"}
                    </span>
                  )}
                  <Link href={`/tasks/${task.key}`} className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{translateTaskTitle(task.key, task.title)}</span>
                    <span className="mt-0.5 block truncate text-[11px] text-white/70">
                      {assignedMember ? translateMemberName(assignedMember.name) : "বরাদ্দ নেই"}{isMyTurn ? " · আপনার পালা" : ""}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </SurfaceCard>

      <OutstandingExpenseSummary
        onExpensesLoaded={updateSharedExpensesTotal}
      />

      <SurfaceCard className="home-expense-card p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="home-card-eyebrow">বাকি থাকা সবার খরচ</h2>
            <p className="mt-2 max-w-md text-xs leading-5 text-white/65">
              ঘরের খরচের স্বচ্ছ হিসাব রাখুন এবং সবার মধ্যে ভাগ করে নিন।
            </p>
          </div>
          <Link href="/expenses" className="home-text-link shrink-0">বিস্তারিত <span aria-hidden="true">›</span></Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <Link href="/expenses?action=add" className="home-expense-action home-quick-split">
            দ্রুত ভাগ করুন
          </Link>
          <Link href="/expenses?view=splits" className="home-expense-action home-expense-split">
            খরচ ভাগের হিসাব
          </Link>
        </div>
      </SurfaceCard>
    </PageFrame>
  );
}
