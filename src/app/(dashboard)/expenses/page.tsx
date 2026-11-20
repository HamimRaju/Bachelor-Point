"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  PageFrame,
  Pill,
  PillButton,
  SectionHeading,
  SurfaceCard,
} from "@/components/ui";

type MemberName = "Raju" | "Rubel" | "Arefin" | "Real" | "Radin";
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

interface ExtraExpense {
  id: number;
  title: string;
  payer: MemberName;
  date: string;
  totalAmount: number;
  perPerson: number;
  membersCount: number;
  memberPaid: PaidMap;
}

const FLAT_MEMBERS: MemberName[] = ["Raju", "Rubel", "Arefin", "Real", "Radin"];
const createUnpaidMap = (): PaidMap => ({ Raju: false, Rubel: false, Arefin: false, Real: false, Radin: false });
const initialBills: Bill[] = [
  { id: "wifi", title: "WiFi Bill", totalAmount: 750, perPerson: 150, due: "20 Oct 2026", statuses: createUnpaidMap() },
  { id: "moyla", title: "Moyla Bill", totalAmount: 150, perPerson: 30, due: "15 Oct 2026", statuses: createUnpaidMap() },
  {
    id: "rent", title: "Basha Vara", totalAmount: 15000, perPerson: null, due: "01 Nov 2026",
    customAmounts: { Raju: 3200, Rubel: 3000, Arefin: 3000, Real: 2900, Radin: 2900 },
    statuses: createUnpaidMap(),
  },
];
const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "fixed", label: "Bills" },
  { key: "splits", label: "Expenses" },
  { key: "breakdown", label: "Balances" },
];

export default function ExpensesPage() {
  const searchParams = useSearchParams();
  const shouldOpenAddExpense = searchParams.get("action") === "add";
  const initialTab: TabKey =
    searchParams.get("view") === "splits" || shouldOpenAddExpense ? "splits" : "fixed";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [toast, setToast] = useState<string | null>(null);
  const { data: session } = authClient.useSession();
  const loggedInUserName = session?.user?.name || "Raju";
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(shouldOpenAddExpense);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expensePayer, setExpensePayer] = useState<MemberName>("Radin");
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [extraExpenses, setExtraExpenses] = useState<ExtraExpense[]>([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);
  const selectedExpense = extraExpenses.find((expense) => expense.id === selectedExpenseId) ?? null;
  const totalSharedMonth = extraExpenses.reduce((sum, expense) => sum + expense.totalAmount, 0);
  const monthlyOverview = totalSharedMonth || 2450;

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };
  const isCurrentUser = (memberName: string) => {
    const name = memberName.toLowerCase();
    const user = loggedInUserName.toLowerCase();
    return name.includes(user) || user.includes(name);
  };
  const currentMember = FLAT_MEMBERS.find(isCurrentUser) ?? "Raju";

  const handlePayFixedBill = (billId: string, memberName: MemberName) => {
    if (!isCurrentUser(memberName)) {
      showToast(`Only ${memberName} can mark their share as paid.`);
      return;
    }
    const bill = bills.find((item) => item.id === billId);
    if (!bill) return;
    setBills((current) => current.map((item) => item.id === billId
      ? { ...item, statuses: { ...item.statuses, [memberName]: true } }
      : item,
    ));
    showToast(`${bill.title} marked paid for ${memberName}.`);
  };

  const handlePayExpenseSplit = (expenseId: number, memberName: MemberName) => {
    if (!isCurrentUser(memberName)) {
      showToast("You can only settle your own share.");
      return;
    }
    setExtraExpenses((current) => current.map((expense) => expense.id === expenseId
      ? { ...expense, memberPaid: { ...expense.memberPaid, [memberName]: true } }
      : expense,
    ));
    showToast("Your share has been settled.");
  };

  const handleAddExpenseSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = expenseTitle.trim();
    const amount = Number(expenseAmount);
    if (!title || !Number.isFinite(amount) || amount <= 0) {
      showToast("Enter an expense name and a valid amount.");
      return;
    }
    const count = FLAT_MEMBERS.length;
    const newExpense: ExtraExpense = {
      id: Date.now(), title, payer: expensePayer, date: "Just now", totalAmount: amount,
      perPerson: Math.round(amount / count), membersCount: count, memberPaid: createUnpaidMap(),
    };
    setExtraExpenses((current) => [newExpense, ...current]);
    setSelectedExpenseId(newExpense.id);
    setActiveTab("splits");
    setIsAddExpenseOpen(false);
    setExpenseTitle("");
    setExpenseAmount("");
    showToast("Expense added and split between flatmates.");
  };

  return (
    <PageFrame className="palette-page">
      {toast && <div role="status" className="fixed left-1/2 top-4 z-[60] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full bg-[#FBE2B4] px-4 py-2.5 text-center text-xs font-bold text-[#131321] shadow-none">{toast}</div>}

      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="mt-1 text-sm text-white/65">Bills and shared spending</p>
        </div>
        <PillButton type="button" onClick={() => setIsAddExpenseOpen(true)} className="shrink-0">
          <span className="text-base leading-none">+</span> Add expense
        </PillButton>
      </header>

      <SurfaceCard className="p-5">
        <p className="text-xs text-white/65">Shared this month</p>
        <p className="mt-1 text-3xl font-bold tracking-tight">৳{monthlyOverview.toLocaleString()}</p>
      </SurfaceCard>

      <div role="tablist" aria-label="Expense views" className="flex gap-1 rounded-full border border-white/10 bg-white/10 p-1">
        {tabs.map((tab) => (
          <button key={tab.key} type="button" role="tab" aria-selected={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} className={`flex-1 rounded-full px-3 py-2.5 text-xs font-bold transition-colors ${activeTab === tab.key ? "bg-[#46F0D2] text-[#131321]" : "text-white/70"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "fixed" && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-white">Fixed monthly bills</h2>
          {bills.map((bill) => {
            const paidCount = Object.values(bill.statuses).filter(Boolean).length;
            const amount = bill.perPerson ?? bill.customAmounts?.[currentMember] ?? 0;
            const isPaid = bill.statuses[currentMember];
            return (
              <SurfaceCard key={bill.id} className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold">{bill.title}</h2>
                      <p className="mt-1 text-xs text-white/60">Due {bill.due}</p>
                  </div>
                    <p className="shrink-0 text-sm font-bold">৳{bill.totalAmount.toLocaleString()}</p>
                  </div>
                  <p className="mt-2 text-xs text-white/60">
                    Your share ৳{amount.toLocaleString()} · {paidCount}/{FLAT_MEMBERS.length} paid
                  </p>
                </div>
                {isPaid ? (
                  <span className="text-xs font-semibold text-white/65">Paid ✓</span>
                ) : (
                  <PillButton type="button" onClick={() => handlePayFixedBill(bill.id, currentMember)} className="px-3 py-2">
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
          <h2 className="text-sm font-semibold text-white">Shared expenses</h2>
          {extraExpenses.length === 0 ? (
            <SurfaceCard className="p-7 text-center">
              <p className="text-sm font-bold">No shared expenses yet</p>
              <p className="mt-1 text-xs leading-5 text-white/60">Add a household expense to split it between your flatmates.</p>
            </SurfaceCard>
          ) : extraExpenses.map((expense) => {
            const paidCount = Object.values(expense.memberPaid).filter(Boolean).length;
            return (
              <SurfaceCard key={expense.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-bold">{expense.title}</h2>
                    <p className="mt-1 text-xs text-white/60">Paid by {expense.payer} · {expense.date}</p>
                  </div>
                  <p className="shrink-0 text-base font-bold">৳{expense.totalAmount.toLocaleString()}</p>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                  <div><p className="text-xs text-white/60">৳{expense.perPerson.toLocaleString()} each</p><Pill tone={paidCount === 5 ? "cyan" : "gold"} className="mt-1 px-2 py-0.5 text-[10px]">{paidCount}/5 settled</Pill></div>
                  <button type="button" onClick={() => { setSelectedExpenseId(expense.id); setActiveTab("breakdown"); }} className="text-xs font-bold underline underline-offset-2">View balances</button>
                </div>
              </SurfaceCard>
            );
          })}
        </section>
      )}

      {activeTab === "breakdown" && (
        <section className="space-y-3">
          <SectionHeading title="Balances & splits" subtitle="See each flatmate’s share and settlement status." />
          {!selectedExpense ? (
            <SurfaceCard className="p-6 text-center">
              <p className="text-sm font-bold">No selected expense</p>
              <p className="mt-1 text-xs text-white/60">Choose an expense to view its member-by-member split.</p>
              {extraExpenses.length > 0 && <button type="button" onClick={() => { setSelectedExpenseId(extraExpenses[0].id); }} className="mt-4 rounded-full bg-[#46F0D2] px-4 py-2 text-xs font-bold">View latest split</button>}
            </SurfaceCard>
          ) : (
            <>
              <SurfaceCard className="p-5">
                <p className="text-xs text-white/60">{selectedExpense.date} · Paid by {selectedExpense.payer}</p>
                <h2 className="mt-1 text-lg font-bold">{selectedExpense.title}</h2>
                <p className="mt-2 text-2xl font-bold">৳{selectedExpense.totalAmount.toLocaleString()}</p>
                <Pill tone="gold" className="mt-2">৳{selectedExpense.perPerson.toLocaleString()} each · {selectedExpense.membersCount} members</Pill>
              </SurfaceCard>
              <SurfaceCard className="divide-y divide-white/10 px-4">
                {FLAT_MEMBERS.map((member) => {
                  const paid = selectedExpense.memberPaid[member];
                  const isUser = isCurrentUser(member);
                  return (
                    <div key={member} className="flex items-center gap-2 py-3.5">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{member}{isUser ? " · You" : ""}</p>
                        <p className="mt-0.5 text-[11px] text-white/60">Share ৳{selectedExpense.perPerson.toLocaleString()}</p>
                      </div>
                      {paid ? <Pill tone="cyan">Paid ✓</Pill> : isUser ? (
                        <PillButton type="button" onClick={() => handlePayExpenseSplit(selectedExpense.id, member)} className="px-3.5 py-2">Settle up</PillButton>
                      ) : <Pill tone="gold">Pending</Pill>}
                    </div>
                  );
                })}
              </SurfaceCard>
            </>
          )}
        </section>
      )}

      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#131321]/85 p-4">
          <SurfaceCard className="w-full max-w-sm p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-bold">Add shared expense</h2>
              <button type="button" onClick={() => setIsAddExpenseOpen(false)} aria-label="Close" className="gradient-panel flex h-9 w-9 items-center justify-center rounded-full text-white">×</button>
            </div>
            <form onSubmit={handleAddExpenseSubmit} className="mt-4 space-y-3">
              <label className="block text-xs font-bold">Expense name
                <input value={expenseTitle} onChange={(event) => setExpenseTitle(event.target.value)} required placeholder="e.g. Groceries" className="mt-1.5 w-full rounded-2xl border border-[#131321]/15 bg-white px-4 py-3 text-sm text-[#131321] placeholder:text-[#131321]/45" />
              </label>
              <label className="block text-xs font-bold">Amount (৳)
                <input type="number" min="1" step="1" value={expenseAmount} onChange={(event) => setExpenseAmount(event.target.value)} required placeholder="0" className="mt-1.5 w-full rounded-2xl border border-[#131321]/15 bg-white px-4 py-3 text-sm text-[#131321] placeholder:text-[#131321]/45" />
              </label>
              <label className="block text-xs font-bold">Paid by
                <select value={expensePayer} onChange={(event) => setExpensePayer(event.target.value as MemberName)} className="mt-1.5 w-full rounded-2xl border border-[#131321]/15 bg-white px-4 py-3 text-sm text-[#131321]">
                  {FLAT_MEMBERS.map((member) => <option key={member} value={member}>{member}</option>)}
                </select>
              </label>
              <button type="submit" className="w-full rounded-full bg-[#46F0D2] py-3 text-sm font-bold text-[#131321]">Save &amp; split expense</button>
            </form>
          </SurfaceCard>
        </div>
      )}
    </PageFrame>
  );
}
