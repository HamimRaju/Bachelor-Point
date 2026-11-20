"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getExpenses,
  settleExpenseShare,
} from "@/actions/expense.actions";
import { PillButton, SurfaceCard } from "@/components/ui";
import type { ExpenseView } from "@/lib/expense-view";
import { banglaError, formatBnNumber, translateMemberName } from "@/lib/bn";

export default function OutstandingExpenseSummary({
  onExpensesLoaded,
}: {
  onExpensesLoaded?: (expenses: ExpenseView[]) => void;
}) {
  const [memberId, setMemberId] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<ExpenseView[]>([]);
  const [settlingId, setSettlingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadExpenses = async () => {
      try {
        const result = await getExpenses();
        if (!mounted) return;
        setMemberId(result.memberId);
        setExpenses(result.expenses);
        onExpensesLoaded?.(result.expenses);
      } catch {
        // Keep the rest of the dashboard available if expenses cannot load.
      }
    };
    const refreshOnFocus = () => {
      if (document.visibilityState === "visible") void loadExpenses();
    };

    void loadExpenses();
    const interval = window.setInterval(refreshOnFocus, 30_000);
    window.addEventListener("focus", refreshOnFocus);

    return () => {
      mounted = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, [onExpensesLoaded]);

  const debts = expenses.flatMap((expense) => {
    const share = expense.splitBetween.find(
      (item) => item.memberId === memberId,
    );
    return share?.status === "Pending" ? [{ expense, share }] : [];
  });
  const totalOwed = debts.reduce((sum, item) => sum + item.share.amount, 0);

  if (debts.length === 0) return null;

  const handleSettle = async (expenseId: string) => {
    if (settlingId) return;
    setSettlingId(expenseId);
    setNotice(null);
    try {
      const result = await settleExpenseShare(expenseId);
      setExpenses((current) =>
        current.map((expense) =>
          expense.id === result.expense.id ? result.expense : expense,
        ),
      );
      setNotice(
        result.alreadyPaid
          ? "এই পরিশোধের তথ্য আগেই নথিভুক্ত হয়েছে।"
          : "আপনার পরিশোধের তথ্য নথিভুক্ত হয়েছে।",
      );
    } catch (error) {
      setNotice(
        banglaError(error, "আপনার পরিশোধের তথ্য নথিভুক্ত করা যায়নি।"),
      );
    } finally {
      setSettlingId(null);
    }
  };

  return (
    <SurfaceCard className="home-expense-debt p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="home-card-eyebrow">আপনার বাকি থাকা অংশ</h2>
          <p className="mt-1 text-xs text-white/60">
            মোট বাকি:{" "}
            <strong className="text-white">৳{formatBnNumber(totalOwed)}</strong>
          </p>
        </div>
        <Link href="/expenses?view=splits" className="home-text-link">
          সব বাকি <span aria-hidden="true">›</span>
        </Link>
      </div>

      <div className="mt-3 space-y-3">
        {debts.slice(0, 3).map(({ expense, share }) => (
          <div
            key={expense.id}
            className="flex items-center gap-3 border-t border-white/10 pt-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{expense.title}</p>
              <p className="mt-0.5 text-xs text-white/65">
                আপনাকে দিতে হবে{" "}
                <strong className="text-[#a5f3d6]">
                  ৳{formatBnNumber(share.amount)}
                </strong>{" "}
                {translateMemberName(expense.paidByName)}-কে
              </p>
            </div>
            <PillButton
              type="button"
              onClick={() => void handleSettle(expense.id)}
              disabled={Boolean(settlingId)}
              className="shrink-0 px-3 py-2"
            >
              {settlingId === expense.id ? "সংরক্ষণ হচ্ছে…" : "পরিশোধিত চিহ্নিত করুন"}
            </PillButton>
          </div>
        ))}
      </div>
      {debts.length > 3 && (
        <p className="mt-3 text-[11px] text-white/55">
          আরও {formatBnNumber(debts.length - 3)}টি বাকি খরচ আছে।
        </p>
      )}
      {notice && (
        <p role="status" className="mt-3 text-xs text-[#a5f3d6]">
          {notice}
        </p>
      )}
    </SurfaceCard>
  );
}
