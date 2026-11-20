"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  createCustomExpense,
  getExpenses,
  settleExpenseShare,
} from "@/actions/expense.actions";
import {
  getFixedBills,
  markFixedBillAsPaid,
} from "@/actions/bill.actions";
import {
  PageFrame,
  Pill,
  PillButton,
  SectionHeading,
  SurfaceCard,
} from "@/components/ui";
import { FLAT_MEMBERS as MEMBER_RECORDS } from "@/lib/members";
import type { ExpenseView } from "@/lib/expense-view";
import {
  banglaError,
  formatBnDate,
  formatBnNumber,
  translateMemberName,
} from "@/lib/bn";

type TabKey = "fixed" | "splits" | "breakdown";
type MemberName = (typeof MEMBER_RECORDS)[number]["name"];

interface FixedBillConfig {
  id: "wifi" | "moyla" | "rent";
  title: string;
  totalAmount: number;
  perPerson: number | null;
  due: string;
  customAmounts?: Partial<Record<MemberName, number>>;
}

type FixedBill = FixedBillConfig & {
  paidMemberIds: string[];
};

const FLAT_MEMBERS = MEMBER_RECORDS;
const FIXED_BILL_CONFIG: FixedBillConfig[] = [
  {
    id: "wifi",
    title: "ওয়াই-ফাই বিল",
    totalAmount: 750,
    perPerson: 150,
    due: "২০ অক্টোবর ২০২৬",
  },
  {
    id: "moyla",
    title: "ময়লা বিল",
    totalAmount: 150,
    perPerson: 30,
    due: "১৫ অক্টোবর ২০২৬",
  },
  {
    id: "rent",
    title: "বাসা ভাড়া",
    totalAmount: 15000,
    perPerson: null,
    due: "১ নভেম্বর ২০২৬",
    customAmounts: { Raju: 3200, Rubel: 3000, Arefin: 3000, Real: 2900, Radin: 2900 },
  },
];
const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "fixed", label: "বিল" },
  { key: "splits", label: "খরচ" },
  { key: "breakdown", label: "হিসাব" },
];

function formatDate(date: string) {
  return formatBnDate(date);
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
  const [bills, setBills] = useState<FixedBill[]>([]);
  const [isLoadingBills, setIsLoadingBills] = useState(true);
  const [billsError, setBillsError] = useState<string | null>(null);
  const [settlingBillId, setSettlingBillId] = useState<string | null>(null);
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
            banglaError(error, "সবার খরচের তালিকা লোড করা যায়নি।"),
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

  useEffect(() => {
    if (activeTab !== "fixed") return;

    let mounted = true;
    let isLoading = false;

    const loadBills = async () => {
      if (isLoading) return;
      isLoading = true;
      try {
        const result = await getFixedBills();
        if (!mounted) return;
        setCurrentMemberId(result.memberId);
        const paymentsByKey = new Map(
          result.bills.map((bill) => [bill.key, bill] as const),
        );
        setBills(
          FIXED_BILL_CONFIG.map((bill) => {
            return {
              ...bill,
              paidMemberIds: paymentsByKey.get(bill.id)?.paidMemberIds ?? [],
            };
          }),
        );
        setBillsError(null);
      } catch (error) {
        if (mounted) {
          setBillsError(
            banglaError(error, "মাসিক বিলের তালিকা লোড করা যায়নি।"),
          );
        }
      } finally {
        isLoading = false;
        if (mounted) setIsLoadingBills(false);
      }
    };

    const refreshOnFocus = () => {
      if (document.visibilityState === "visible") void loadBills();
    };

    void loadBills();
    const interval = window.setInterval(refreshOnFocus, 5_000);
    window.addEventListener("focus", refreshOnFocus);

    return () => {
      mounted = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, [activeTab]);

  const handlePayFixedBill = async (bill: FixedBill) => {
    if (settlingBillId) return;

    setSettlingBillId(bill.id);
    try {
      const result = await markFixedBillAsPaid(bill.id);
      setCurrentMemberId(result.memberId);
      setBills((current) =>
        current.map((currentBill) =>
          currentBill.id === result.bill.key
            ? { ...currentBill, paidMemberIds: result.bill.paidMemberIds }
            : currentBill,
        ),
      );
      showToast(
        result.alreadyPaid
          ? "আপনার পরিশোধের তথ্য আগেই নথিভুক্ত হয়েছে।"
          : "আপনার পরিশোধের তথ্য নথিভুক্ত হয়েছে এবং ফ্ল্যাটের সবার সঙ্গে শেয়ার করা হয়েছে।",
      );
    } catch (error) {
      showToast(
        banglaError(error, "আপনার পরিশোধের তথ্য নথিভুক্ত করা যায়নি।"),
      );
    } finally {
      setSettlingBillId(null);
    }
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
          ? "এই পরিশোধের তথ্য আগেই নথিভুক্ত হয়েছে।"
          : "আপনার পরিশোধের তথ্য নথিভুক্ত হয়েছে।",
      );
    } catch (error) {
      showToast(
        banglaError(error, "পরিশোধের তথ্য নথিভুক্ত করা যায়নি।"),
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
      showToast("খরচের নাম ও সঠিক পূর্ণ সংখ্যার পরিমাণ লিখুন।");
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
      showToast("খরচটি সংরক্ষিত হয়েছে এবং ফ্ল্যাটের পাঁচজনের মধ্যে ভাগ করা হয়েছে।");
    } catch (error) {
      showToast(
        banglaError(error, "খরচটি সংরক্ষণ করা যায়নি।"),
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
          <h1 className="mt-1 text-2xl font-bold tracking-tight">খরচ ও বিল</h1>
          <p className="mt-1 text-sm text-white/65">
            বিল, সবার খরচ ও পরিশোধের হিসাব
          </p>
        </div>
        <PillButton
          type="button"
          onClick={() => setIsAddExpenseOpen(true)}
          className="shrink-0"
        >
          <span className="text-base leading-none">+</span> খরচ যোগ করুন
        </PillButton>
      </header>

      <SurfaceCard className="grid grid-cols-2 gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-xs text-white/65">নথিভুক্ত সবার মোট খরচ</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">
            ৳{formatBnNumber(totalSharedAmount)}
          </p>
        </div>
        <div className="min-w-0 border-l border-white/10 pl-3">
          <p className="text-xs text-white/65">আপনার বাকি পরিশোধ</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">
            ৳{formatBnNumber(totalOwed)}
          </p>
        </div>
      </SurfaceCard>

      <div
        role="tablist"
        aria-label="খরচের বিভিন্ন হিসাব"
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
            নির্ধারিত মাসিক বিল
          </h2>
          {isLoadingBills && bills.length === 0 ? (
            <SurfaceCard className="p-5 text-sm text-white/70">
              মাসিক বিল লোড হচ্ছে…
            </SurfaceCard>
          ) : billsError && bills.length === 0 ? (
            <SurfaceCard className="p-5 text-sm text-white/70">
              {billsError}
            </SurfaceCard>
          ) : bills.length === 0 ? (
            <SurfaceCard className="p-5 text-sm text-white/70">
              এখনো কোনো মাসিক বিল যোগ করা হয়নি।
            </SurfaceCard>
          ) : (
            bills.map((bill) => {
              const paidCount = bill.paidMemberIds.length;
              const pendingCount = FLAT_MEMBERS.length - paidCount;
              const amount =
                bill.perPerson ?? bill.customAmounts?.[currentMember.name] ?? 0;
              const isPaid = bill.paidMemberIds.includes(currentMember.id);

              return (
                <SurfaceCard key={bill.id} className="flex items-center gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-sm font-bold">{bill.title}</h2>
                        <p className="mt-1 text-xs text-white/60">
                          জমা দেওয়ার তারিখ: {bill.due}
                        </p>
                        <div
                          role="group"
                          aria-label="সদস্যভিত্তিক পরিশোধের অবস্থা"
                          className="mt-3 flex items-center -space-x-2"
                        >
                          {FLAT_MEMBERS.map((member) => {
                            const isMemberPaid = bill.paidMemberIds.includes(member.id);

                            return (
                              <span
                                key={member.id}
                                title={`${translateMemberName(member.name)}: ${isMemberPaid ? "পরিশোধিত" : "বাকি"}`}
                                aria-label={`${translateMemberName(member.name)}: ${isMemberPaid ? "পরিশোধিত" : "বাকি"}`}
                                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#17172d] text-xs font-bold text-white ${
                                  isMemberPaid ? "bg-[#10B981]" : "bg-slate-300"
                                }`}
                              >
                                {translateMemberName(member.name).charAt(0)}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <p className="shrink-0 text-sm font-bold">
                        ৳{formatBnNumber(bill.totalAmount)}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-white/60">
                      আপনার অংশ ৳{formatBnNumber(amount)} ·{" "}
                      {formatBnNumber(paidCount)} জন দিয়েছেন · {formatBnNumber(pendingCount)} জন বাকি
                    </p>
                  </div>
                  {isPaid ? (
                    <span className="text-xs font-semibold text-white/65">
                      পরিশোধিত ✓
                    </span>
                  ) : (
                    <PillButton
                      type="button"
                      onClick={() => void handlePayFixedBill(bill)}
                      disabled={Boolean(settlingBillId)}
                      className="px-3 py-2"
                    >
                      {settlingBillId === bill.id ? "সংরক্ষণ হচ্ছে…" : "পরিশোধ করুন"}
                    </PillButton>
                  )}
                </SurfaceCard>
              );
            })
          )}
        </section>
      )}

      {activeTab === "splits" && (
        <section className="space-y-3">
          <SectionHeading
            title="সবার খরচ"
            subtitle="প্রতিটি খরচে আপনার অংশ ও কাকে কত দিতে হবে তা দেখুন।"
          />
          {isLoadingExpenses ? (
            <SurfaceCard className="p-5 text-sm text-white/70">
              সবার খরচের তালিকা লোড হচ্ছে…
            </SurfaceCard>
          ) : expensesError && expenses.length === 0 ? (
            <SurfaceCard className="p-5 text-sm text-white/70">
              {expensesError}
            </SurfaceCard>
          ) : expenses.length === 0 ? (
            <SurfaceCard className="p-7 text-center">
              <p className="text-sm font-bold">এখনো কোনো খরচ যোগ করা হয়নি</p>
              <p className="mt-1 text-xs leading-5 text-white/60">
                আপনার দেওয়া কোনো খরচ যোগ করুন; পাঁচজনের ভাগ এখানে সবার জন্য দেখা যাবে।
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
                        দিয়েছেন {translateMemberName(expense.paidByName)} · {formatDate(expense.createdAt)}
                      </p>
                      <div
                        role="group"
                        aria-label="সদস্যভিত্তিক পরিশোধের অবস্থা"
                        className="mt-3 flex items-center -space-x-2"
                      >
                        {expense.splitBetween.map((share) => {
                          const isPaid = share.status === "Paid";

                          return (
                            <span
                              key={share.memberId}
                              title={`${translateMemberName(share.memberName)}: ${isPaid ? "পরিশোধিত" : "বাকি"}`}
                              aria-label={`${translateMemberName(share.memberName)}: ${isPaid ? "পরিশোধিত" : "বাকি"}`}
                              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#17172d] text-xs font-bold text-white ${
                                isPaid ? "bg-[#10B981]" : "bg-slate-300"
                              }`}
                            >
                              {translateMemberName(share.memberName).charAt(0)}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <p className="shrink-0 text-base font-bold">
                  ৳{formatBnNumber(expense.totalAmount)}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
                    <div>
                      {myShare?.status === "Pending" ? (
                        <p className="text-sm font-semibold text-[#9af0d1]">
                          আপনাকে {translateMemberName(expense.paidByName)}-কে ৳{formatBnNumber(myShare.amount)} দিতে হবে
                        </p>
                      ) : myShare ? (
                        <p className="text-sm font-semibold text-white/85">
                          আপনার ৳{formatBnNumber(myShare.amount)}-এর অংশ পরিশোধিত
                        </p>
                      ) : (
                        <p className="text-sm font-semibold text-white/65">
                          আপনার অংশের হিসাব লোড হচ্ছে…
                        </p>
                      )}
                      {myShare?.status === "Paid" && myShare.paidAt && (
                        <p className="mt-1 text-[11px] text-white/55">
                          নথিভুক্ত হয়েছে {formatDate(myShare.paidAt)}
                        </p>
                      )}
                      <Pill
                        tone={paidCount === FLAT_MEMBERS.length ? "cyan" : "gold"}
                        className="mt-2 px-2 py-0.5 text-[10px]"
                      >
                        {formatBnNumber(paidCount)}/{formatBnNumber(FLAT_MEMBERS.length)} জন পরিশোধ করেছেন
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
                          {isSettling ? "সংরক্ষণ হচ্ছে…" : "পরিশোধিত চিহ্নিত করুন"}
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
                        বিস্তারিত হিসাব
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
            title="ভাগ ও পরিশোধের হিসাব"
            subtitle="কে পরিশোধ করেছেন, কার ভাগ কত এবং কখন নথিভুক্ত হয়েছে দেখুন।"
          />
          {!selectedExpense ? (
            <SurfaceCard className="p-6 text-center">
              <p className="text-sm font-bold">একটি খরচ বেছে নিন</p>
              <p className="mt-1 text-xs text-white/60">
                প্রত্যেক সদস্যের পরিশোধের তথ্য এখানে দেখা যাবে।
              </p>
              {expenses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedExpenseId(expenses[0].id)}
                  className="mt-4 rounded-full bg-[#46F0D2] px-4 py-2 text-xs font-bold"
                >
                  সর্বশেষ ভাগের হিসাব দেখুন
                </button>
              )}
            </SurfaceCard>
          ) : (
            <>
              <SurfaceCard className="p-5">
                <p className="text-xs text-white/60">
                  দিয়েছেন {translateMemberName(selectedExpense.paidByName)} ·{" "}
                  {formatDate(selectedExpense.createdAt)}
                </p>
                <h2 className="mt-1 text-lg font-bold">
                  {selectedExpense.title}
                </h2>
                <p className="mt-2 text-2xl font-bold">
                  ৳{formatBnNumber(selectedExpense.totalAmount)}
                </p>
                <p className="mt-1 text-xs text-white/60">
                  {formatBnNumber(selectedExpense.splitBetween.length)} জনের মধ্যে ভাগ করা হয়েছে
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
                          {translateMemberName(share.memberName)}
                          {isYou ? " · আপনি" : ""}
                        </p>
                        <p className="mt-0.5 text-[11px] text-white/60">
                          আপনার অংশ ৳{formatBnNumber(share.amount)}
                          {share.status === "Paid" && share.paidAt
                            ? ` · পরিশোধিত ${formatDate(share.paidAt)}`
                            : ""}
                        </p>
                      </div>
                      {share.status === "Paid" ? (
                        <Pill tone="cyan">পরিশোধিত ✓</Pill>
                      ) : (
                        <Pill tone="gold">দেওয়া বাকি</Pill>
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
                  নতুন সবার খরচ
                </p>
                <h2 className="mt-1 text-base font-bold">খরচ যোগ করুন</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddExpenseOpen(false)}
                aria-label="বন্ধ করুন"
                className="gradient-panel flex h-9 w-9 items-center justify-center rounded-full text-white"
              >
                ×
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#131321]/60">
              খরচটি ফ্ল্যাটের পাঁচজনের মধ্যে ভাগ হবে। যিনি পরিশোধ করেছেন হিসেবে আপনার নাম নথিভুক্ত হবে।
            </p>
            <form onSubmit={handleAddExpenseSubmit} className="mt-4 space-y-3">
              <label className="block text-xs font-bold">
                খরচের নাম
                <input
                  value={expenseTitle}
                  onChange={(event) => setExpenseTitle(event.target.value)}
                  required
                  maxLength={100}
                  placeholder="যেমন: বাজার"
                  className="mt-1.5 w-full rounded-2xl border border-[#131321]/15 bg-white px-4 py-3 text-base text-[#131321] placeholder:text-[#131321]/45 sm:text-sm"
                />
              </label>
              <label className="block text-xs font-bold">
                মোট পরিমাণ (৳)
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
                  পরিশোধ করেছেন
                </p>
                <p className="mt-0.5 text-sm font-bold text-[#131321]">
                  {translateMemberName(currentMember.name)} · আপনি
                </p>
              </div>
              <button
                type="submit"
                disabled={isSavingExpense}
                className="w-full rounded-full bg-[#46F0D2] py-3 text-sm font-bold text-[#131321] disabled:cursor-wait disabled:opacity-60"
              >
                {isSavingExpense ? "খরচ সংরক্ষণ হচ্ছে…" : "সংরক্ষণ করে ভাগ করুন"}
              </button>
            </form>
          </SurfaceCard>
        </div>
      )}
    </PageFrame>
  );
}
