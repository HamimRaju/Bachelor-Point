"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  createCustomExpense,
  getExpenses,
  settleExpenseShare,
} from "@/actions/expense.actions";
import {
  PageFrame,
  Pill,
  PillButton,
  SectionHeading,
  SurfaceCard,
} from "@/components/ui";
import { FLAT_MEMBERS as MEMBER_RECORDS } from "@/lib/members";
import type { ExpenseView } from "@/lib/expense-view";

type MemberName = (typeof MEMBER_RECORDS)[number]["name"];
type TabKey = "fixed" | "splits" | "breakdown";
type PaidMap = Record<MemberName, boolean>;

interface Bill {
  id: string;
  title: string;
  totalAmount: number;
  perPerson: number | null;
  due: string;
  customAmounts?: Record<MemberName, number>;
  statuses: PaidMap;
}

const FLAT_MEMBERS: MemberName[] = MEMBER_RECORDS.map((member) => member.name);
const createUnpaidMap = (): PaidMap => ({
  Raju: false,
  Rubel: false,
  Arefin: false,
  Real: false,
  Radin: false,
});
const initialBills: Bill[] = [
  {
    id: "wifi",
    title: "WiFi Bill",
    totalAmount: 750,
    perPerson: 150,
    due: "20 Oct 2026",
    statuses: createUnpaidMap(),
  },
  {
    id: "moyla",
    title: "Moyla Bill",
    totalAmount: 150,
    perPerson: 30,
    due: "15 Oct 2026",
    statuses: createUnpaidMap(),
  },
  {
    id: "rent",
    title: "Basha Vara",
    totalAmount: 15000,
    perPerson: null,
    due: "01 Nov 2026",
    customAmounts: { Raju: 3200, Rubel: 3000, Arefin: 3000, Real: 2900, Radin: 2900 },
    statuses: createUnpaidMap(),
  },
];
const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "fixed", label: "Bills" },
  { key: "splits", label: "Expenses" },
  { key: "breakdown", label: "Balances" },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ExpensesPage() {
  const searchParams = useSearchParams();
  const shouldOpenAddExpense = searchParams.get("action") === "add";
  const initialTab: TabKey =
    searchParams.get("view") === "splits" || shouldOpenAddExpense
      ? "splits"
      : "fixed";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [toast, setToast] = useState<string | null>(null);
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<ExpenseView[]>([]);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);
  const [expensesError, setExpensesError] = useState<string | null>(null);
  const [isSavingExpense, setIsSavingExpense] = useState(false);
  const [settlingExpenseId, setSettlingExpenseId] = useState<string | null>(null);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(shouldOpenAddExpense);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);

  const currentMember =
    MEMBER_RECORDS.find((member) => member.id === currentMemberId) ??
    MEMBER_RECORDS[0];
  const selectedExpense =
    expenses.find((expense) => expense.id === selectedExpenseId) ?? null;
  const totalSharedAmount = expenses.reduce(
    (sum, expense) => sum + expense.totalAmount,
    0,
  );
  const myOutstandingShares = expenses.flatMap((expense) => {
    const share = expense.splitBetween.find(
      (item) => item.memberId === currentMemberId,
    );
    return share?.status === "Pending" ? [{ expense, share }] : [];
  });
  const totalOwed = myOutstandingShares.reduce(
    (sum, item) => sum + item.share.amount,
    0,
  );

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  };

  useEffect(() => {
    let mounted = true;

    const loadExpenses = async () => {
      try {
        const result = await getExpenses();
        if (!mounted) return;
        setCurrentMemberId(result.memberId);
        setExpenses(result.expenses);
        setExpensesError(null);
      } catch (error) {
        if (mounted) {
          setExpensesError(
            error instanceof Error ? error.message : "Unable to load shared expenses.",
          );
        }
      } finally {
        if (mounted) setIsLoadingExpenses(false);
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
  }, []);

  const isCurrentUser = (memberName: MemberName) =>
    memberName === currentMember.name;

  const handlePayFixedBill = (billId: string, memberName: MemberName) => {
    if (!isCurrentUser(memberName)) {
      showToast(`Only ${memberName} can mark their share as paid.`);
      return;
    }

    setBills((current) =>
      current.map((bill) =>
        bill.id === billId
          ? { ...bill, statuses: { ...bill.statuses, [memberName]: true } }
          : bill,
      ),
    );
    showToast("Your bill status was updated.");
  };

  const handleSettleExpense = async (expenseId: string) => {
    if (settlingExpenseId) return;
    setSettlingExpenseId(expenseId);
    try {
      const result = await settleExpenseShare(expenseId);
      setExpenses((current) =>
        current.map((expense) =>
          expense.id === result.expense.id ? result.expense : expense,
        ),
      );
      showToast(
        result.alreadyPaid
          ? "This payment is already recorded."
          : "Your payment has been recorded.",
      );
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Could not record the payment.",
      );
    } finally {
      setSettlingExpenseId(null);
    }
  };

  const handleAddExpenseSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const title = expenseTitle.trim();
    const amount = Number(expenseAmount);

    if (!title || !Number.isSafeInteger(amount) || amount <= 0) {
      showToast("Enter an expense name and a valid whole amount.");
      return;
    }

    setIsSavingExpense(true);
    try {
      const result = await createCustomExpense({
        title,
        totalAmount: amount,
      });
      setCurrentMemberId(result.memberId);
      setExpenses((current) => [
        result.expense,
        ...current.filter((expense) => expense.id !== result.expense.id),
      ]);
      setSelectedExpenseId(result.expense.id);
      setActiveTab("splits");
      setIsAddExpenseOpen(false);
      setExpenseTitle("");
      setExpenseAmount("");
      showToast("Expense saved and split between all five flatmates.");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Could not save this expense.",
      );
    } finally {
      setIsSavingExpense(false);
    }
  };

  return (
    <PageFrame className="palette-page">
      {toast && (
        <div
          role="status"
          className="fixed left-1/2 top-4 z-[60] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full bg-[#FBE2B4] px-4 py-2.5 text-center text-xs font-bold text-[#131321] shadow-none"
        >
          {toast}
        </div>
      )}

      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="mt-1 text-sm text-white/65">
            Bills, shared spending and repayments
          </p>
        </div>
        <PillButton
          type="button"
          onClick={() => setIsAddExpenseOpen(true)}
          className="shrink-0"
        >
          <span className="text-base leading-none">+</span> Add expense
        </PillButton>
      </header>

      <SurfaceCard className="grid grid-cols-2 gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-xs text-white/65">Shared expenses recorded</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">
            ৳{totalSharedAmount.toLocaleString()}
          </p>
        </div>
        <div className="min-w-0 border-l border-white/10 pl-3">
          <p className="text-xs text-white/65">You still owe</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">
            ৳{totalOwed.toLocaleString()}
          </p>
        </div>
      </SurfaceCard>

      <div
        role="tablist"
        aria-label="Expense views"
        className="flex gap-1 rounded-full border border-white/10 bg-white/10 p-1"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-full px-3 py-2.5 text-xs font-bold transition-colors ${
              activeTab === tab.key
                ? "bg-[#46F0D2] text-[#131321]"
                : "text-white/70"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "fixed" && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-white">
            Fixed monthly bills
          </h2>
          {bills.map((bill) => {
            const paidCount = Object.values(bill.statuses).filter(Boolean).length;
            const amount = bill.perPerson ?? bill.customAmounts?.[currentMember.name] ?? 0;
            const isPaid = bill.statuses[currentMember.name];

            return (
              <SurfaceCard key={bill.id} className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-bold">{bill.title}</h2>
                      <p className="mt-1 text-xs text-white/60">Due {bill.due}</p>
                    </div>
                    <p className="shrink-0 text-sm font-bold">
                      ৳{bill.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-white/60">
                    Your share ৳{amount.toLocaleString()} · {paidCount}/
                    {FLAT_MEMBERS.length} paid
                  </p>
                </div>
                {isPaid ? (
                  <span className="text-xs font-semibold text-white/65">
                    Paid ✓
                  </span>
                ) : (
                  <PillButton
                    type="button"
                    onClick={() => handlePayFixedBill(bill.id, currentMember.name)}
                    className="px-3 py-2"
                  >
                    Pay
                  </PillButton>
                )}
              </SurfaceCard>
            );
          })}
        </section>
      )}

      {activeTab === "splits" && (
        <section className="space-y-3">
          <SectionHeading
            title="Shared expenses"
            subtitle="Your share and who you owe are shown on every expense."
          />
          {isLoadingExpenses ? (
            <SurfaceCard className="p-5 text-sm text-white/70">
              Loading shared expenses…
            </SurfaceCard>
          ) : expensesError && expenses.length === 0 ? (
            <SurfaceCard className="p-5 text-sm text-white/70">
              {expensesError}
            </SurfaceCard>
          ) : expenses.length === 0 ? (
            <SurfaceCard className="p-7 text-center">
              <p className="text-sm font-bold">No shared expenses yet</p>
              <p className="mt-1 text-xs leading-5 text-white/60">
                Add an expense paid by you and its five shares will appear here
                for every flatmate.
              </p>
            </SurfaceCard>
          ) : (
            expenses.map((expense) => {
              const paidCount = expense.splitBetween.filter(
                (share) => share.status === "Paid",
              ).length;
              const myShare = expense.splitBetween.find(
                (share) => share.memberId === currentMemberId,
              );
              const isSettling = settlingExpenseId === expense.id;

              return (
                <SurfaceCard key={expense.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-bold">
                        {expense.title}
                      </h2>
                      <p className="mt-1 text-xs text-white/60">
                        Paid by {expense.paidByName} · {formatDate(expense.createdAt)}
                      </p>
                    </div>
                    <p className="shrink-0 text-base font-bold">
                      ৳{expense.totalAmount.toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
                    <div>
                      {myShare?.status === "Pending" ? (
                        <p className="text-sm font-semibold text-[#9af0d1]">
                          You owe ৳{myShare.amount.toLocaleString()} to{" "}
                          {expense.paidByName}
                        </p>
                      ) : myShare ? (
                        <p className="text-sm font-semibold text-white/85">
                          Your ৳{myShare.amount.toLocaleString()} share is paid
                        </p>
                      ) : (
                        <p className="text-sm font-semibold text-white/65">
                          Your share is loading…
                        </p>
                      )}
                      {myShare?.status === "Paid" && myShare.paidAt && (
                        <p className="mt-1 text-[11px] text-white/55">
                          Recorded {formatDate(myShare.paidAt)}
                        </p>
                      )}
                      <Pill
                        tone={paidCount === FLAT_MEMBERS.length ? "cyan" : "gold"}
                        className="mt-2 px-2 py-0.5 text-[10px]"
                      >
                        {paidCount}/{FLAT_MEMBERS.length} paid
                      </Pill>
                    </div>
                    <div className="flex items-center gap-3">
                      {myShare?.status === "Pending" && (
                        <PillButton
                          type="button"
                          onClick={() => void handleSettleExpense(expense.id)}
                          disabled={Boolean(settlingExpenseId)}
                          className="px-3 py-2"
                        >
                          {isSettling ? "Saving…" : "Mark paid"}
                        </PillButton>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedExpenseId(expense.id);
                          setActiveTab("breakdown");
                        }}
                        className="text-xs font-bold underline underline-offset-2"
                      >
                        Balances
                      </button>
                    </div>
                  </div>
                </SurfaceCard>
              );
            })
          )}
        </section>
      )}

      {activeTab === "breakdown" && (
        <section className="space-y-3">
          <SectionHeading
            title="Balances & splits"
            subtitle="See who paid, each member’s share, and when it was recorded."
          />
          {!selectedExpense ? (
            <SurfaceCard className="p-6 text-center">
              <p className="text-sm font-bold">Choose a shared expense</p>
              <p className="mt-1 text-xs text-white/60">
                Payment records for each flatmate will appear here.
              </p>
              {expenses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedExpenseId(expenses[0].id)}
                  className="mt-4 rounded-full bg-[#46F0D2] px-4 py-2 text-xs font-bold"
                >
                  View latest split
                </button>
              )}
            </SurfaceCard>
          ) : (
            <>
              <SurfaceCard className="p-5">
                <p className="text-xs text-white/60">
                  Paid by {selectedExpense.paidByName} ·{" "}
                  {formatDate(selectedExpense.createdAt)}
                </p>
                <h2 className="mt-1 text-lg font-bold">
                  {selectedExpense.title}
                </h2>
                <p className="mt-2 text-2xl font-bold">
                  ৳{selectedExpense.totalAmount.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-white/60">
                  Split between {selectedExpense.splitBetween.length} flatmates
                </p>
              </SurfaceCard>
              <SurfaceCard className="divide-y divide-white/10 px-4">
                {selectedExpense.splitBetween.map((share) => {
                  const isYou = share.memberId === currentMemberId;
                  return (
                    <div
                      key={share.memberId}
                      className="flex items-center gap-3 py-3.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">
                          {share.memberName}
                          {isYou ? " · You" : ""}
                        </p>
                        <p className="mt-0.5 text-[11px] text-white/60">
                          Share ৳{share.amount.toLocaleString()}
                          {share.status === "Paid" && share.paidAt
                            ? ` · paid ${formatDate(share.paidAt)}`
                            : ""}
                        </p>
                      </div>
                      {share.status === "Paid" ? (
                        <Pill tone="cyan">Paid ✓</Pill>
                      ) : (
                        <Pill tone="gold">Owes payer</Pill>
                      )}
                    </div>
                  );
                })}
              </SurfaceCard>
            </>
          )}
        </section>
      )}

      {expensesError && expenses.length > 0 && (
        <p role="status" className="text-xs text-amber-100/70">
          {expensesError}
        </p>
      )}

      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#131321]/85 p-3 sm:p-4">
          <SurfaceCard className="max-h-[calc(100dvh-1.5rem)] w-full max-w-sm overflow-y-auto p-4 sm:max-h-[calc(100dvh-2rem)] sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#28796d]">
                  New shared cost
                </p>
                <h2 className="mt-1 text-base font-bold">Add expense</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddExpenseOpen(false)}
                aria-label="Close"
                className="gradient-panel flex h-9 w-9 items-center justify-center rounded-full text-white"
              >
                ×
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#131321]/60">
              The cost is split across all five flatmates. You’ll be recorded
              as the person who paid.
            </p>
            <form onSubmit={handleAddExpenseSubmit} className="mt-4 space-y-3">
              <label className="block text-xs font-bold">
                Expense name
                <input
                  value={expenseTitle}
                  onChange={(event) => setExpenseTitle(event.target.value)}
                  required
                  maxLength={100}
                  placeholder="e.g. Groceries"
                  className="mt-1.5 w-full rounded-2xl border border-[#131321]/15 bg-white px-4 py-3 text-base text-[#131321] placeholder:text-[#131321]/45 sm:text-sm"
                />
              </label>
              <label className="block text-xs font-bold">
                Total amount (৳)
                <input
                  type="number"
                  min="1"
                  max="100000000"
                  step="1"
                  value={expenseAmount}
                  onChange={(event) => setExpenseAmount(event.target.value)}
                  required
                  placeholder="0"
                  className="mt-1.5 w-full rounded-2xl border border-[#131321]/15 bg-white px-4 py-3 text-base text-[#131321] placeholder:text-[#131321]/45 sm:text-sm"
                />
              </label>
              <div className="rounded-2xl border border-[#131321]/10 bg-[#131321]/[0.035] px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#131321]/50">
                  Paid by
                </p>
                <p className="mt-0.5 text-sm font-bold text-[#131321]">
                  {currentMember.name} · You
                </p>
              </div>
              <button
                type="submit"
                disabled={isSavingExpense}
                className="w-full rounded-full bg-[#46F0D2] py-3 text-sm font-bold text-[#131321] disabled:cursor-wait disabled:opacity-60"
              >
                {isSavingExpense ? "Saving expense…" : "Save & split expense"}
              </button>
            </form>
          </SurfaceCard>
        </div>
      )}
    </PageFrame>
  );
}
