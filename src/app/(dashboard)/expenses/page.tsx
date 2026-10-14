"use client";

import { useState, type FormEvent } from "react";
import BottomNav from "@/components/BottomNav";
import { authClient } from "@/lib/auth-client";

/* eslint-disable @next/next/no-img-element */

// ---------- Types ----------
type MemberName = "Raju" | "Rubel" | "Arefin" | "Real" | "Radin";
type TabKey = "fixed" | "splits" | "breakdown";
type PaidMap = Record<MemberName, boolean>;

interface Member {
    name: MemberName;
    avatar: string;
}

interface Bill {
    id: string;
    title: string;
    totalAmount: number;
    perPerson: number | null;
    due: string;
    icon: string;
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

// ---------- Constants ----------
const FLAT_MEMBERS: Member[] = [
    { name: "Raju", avatar: "/Raju.jpg" },
    { name: "Rubel", avatar: "/Rubel.jpg" },
    { name: "Arefin", avatar: "/Arefin.jpg" },
    {
        name: "Real",
        avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80",
    },
    {
        name: "Radin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
];

const createUnpaidMap = (): PaidMap => ({
    Raju: false,
    Rubel: false,
    Arefin: false,
    Real: false,
    Radin: false,
});

export default function ExpensesPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("fixed");
    const [toast, setToast] = useState<string | null>(null);

    // Fetch logged-in user from Better Auth session
    const { data: session } = authClient.useSession();
    const loggedInUserName = session?.user?.name || "Raju"; // Fallback to Raju

    // Modal State for Adding Extra Expense
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
    const [expenseTitle, setExpenseTitle] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [expensePayer, setExpensePayer] = useState<MemberName>("Radin");

    // All fixed bills start as Unpaid/Pending for every member (0/5 Paid)
    const [bills, setBills] = useState<Bill[]>([
        {
            id: "wifi",
            title: "WiFi Bill",
            totalAmount: 750,
            perPerson: 150,
            due: "Due: 20 Oct 2026",
            icon: "📶",
            statuses: createUnpaidMap(),
        },
        {
            id: "moyla",
            title: "Moyla Bill",
            totalAmount: 150,
            perPerson: 30,
            due: "Due: 15 Oct 2026",
            icon: "🗑️",
            statuses: createUnpaidMap(),
        },
        {
            id: "rent",
            title: "Basha Vara",
            totalAmount: 15000,
            perPerson: null,
            due: "Due: 01 Nov 2026",
            icon: "🏠",
            customAmounts: {
                Raju: 3200,
                Rubel: 3000,
                Arefin: 3000,
                Real: 2900,
                Radin: 2900,
            },
            statuses: createUnpaidMap(),
        },
    ]);

    // Zero initial extra shared expenses
    const [extraExpenses, setExtraExpenses] = useState<ExtraExpense[]>([]);
    const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(
        null,
    );

    // Derived from the list, so it is always up to date after a payment
    const selectedExpense =
        extraExpenses.find((exp) => exp.id === selectedExpenseId) ?? null;

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2200);
    };

    const totalSharedMonth = extraExpenses.reduce(
        (sum, exp) => sum + exp.totalAmount,
        0,
    );

    // Is this member row the currently logged-in user?
    const isCurrentUser = (memberName: string) => {
        const a = memberName.toLowerCase();
        const b = loggedInUserName.toLowerCase();
        return a.includes(b) || b.includes(a);
    };

    // Pay Fixed Bill (One-way Action)
    const handlePayFixedBill = (billId: string, memberName: MemberName) => {
        if (!isCurrentUser(memberName)) {
            showToast(
                `Access Denied: Only ${memberName} can pay their own bill! ❌`,
            );
            return;
        }

        const bill = bills.find((b) => b.id === billId);
        if (!bill) return;

        setBills((prev) =>
            prev.map((b) =>
                b.id === billId
                    ? { ...b, statuses: { ...b.statuses, [memberName]: true } }
                    : b,
            ),
        );
        showToast(`${bill.title} payment settled for ${memberName}! 🎉`);
    };

    // Pay Extra Expense Split (One-way Action)
    const handlePayExpenseSplit = (
        expenseId: number,
        memberName: MemberName,
    ) => {
        if (!isCurrentUser(memberName)) {
            showToast(`Access Denied: You can only pay your own share! ❌`);
            return;
        }

        const expense = extraExpenses.find((exp) => exp.id === expenseId);
        if (!expense) return;

        setExtraExpenses((prev) =>
            prev.map((exp) =>
                exp.id === expenseId
                    ? {
                          ...exp,
                          memberPaid: { ...exp.memberPaid, [memberName]: true },
                      }
                    : exp,
            ),
        );
        showToast(`Share paid for "${expense.title}"! ✅`);
    };

    // Handle Add Extra Expense Submit
    const handleAddExpenseSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!expenseTitle || !expenseAmount) {
            showToast("Please enter title and amount!");
            return;
        }

        const total = Number(expenseAmount);
        const splitCount = FLAT_MEMBERS.length;
        const perHead = Math.round(total / splitCount);

        const newExpense: ExtraExpense = {
            id: Date.now(),
            title: expenseTitle,
            payer: expensePayer,
            date: "Just now",
            totalAmount: total,
            perPerson: perHead,
            membersCount: splitCount,
            memberPaid: createUnpaidMap(),
        };

        setExtraExpenses((prev) => [newExpense, ...prev]);
        setIsAddExpenseOpen(false);
        setExpenseTitle("");
        setExpenseAmount("");
        showToast(`Expense "${expenseTitle}" added & split equally! 💸`);
    };

    return (
        <main className="min-h-screen bg-slate-100 text-slate-900 pb-28 pt-4 px-4 font-sans relative">
            {/* Toast Alert */}
            {toast && (
                <div className="fixed top-5 right-5 z-50 transition-all duration-300">
                    <div className="px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border bg-slate-900/95 border-slate-700 text-white text-xs font-bold">
                        <span>📢</span>
                        <span>{toast}</span>
                    </div>
                </div>
            )}

            {/* Add Extra Expense Modal */}
            {isAddExpenseOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] p-6 w-full max-w-sm space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-black text-slate-900">
                                Add Extra Shared Expense
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsAddExpenseOpen(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <form
                            onSubmit={handleAddExpenseSubmit}
                            className="space-y-3.5"
                        >
                            <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                    Expense Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Chal (Rice), Oil, Spices"
                                    value={expenseTitle}
                                    onChange={(e) =>
                                        setExpenseTitle(e.target.value)
                                    }
                                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                    Total Amount (Tk)
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g. 500"
                                    value={expenseAmount}
                                    onChange={(e) =>
                                        setExpenseAmount(e.target.value)
                                    }
                                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                    Who Paid?
                                </label>
                                <select
                                    value={expensePayer}
                                    onChange={(e) =>
                                        setExpensePayer(
                                            e.target.value as MemberName,
                                        )
                                    }
                                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                                >
                                    {FLAT_MEMBERS.map((member) => (
                                        <option
                                            key={member.name}
                                            value={member.name}
                                        >
                                            {member.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-blue-600/30 transition active:scale-[0.98]"
                                >
                                    Save & Split Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-md mx-auto space-y-4">
                {/* Navigation Tabs Header */}
                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs gap-1">
                    <button
                        onClick={() => setActiveTab("fixed")}
                        className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition ${
                            activeTab === "fixed"
                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                                : "text-slate-500"
                        }`}
                    >
                        Fixed Bills
                    </button>
                    <button
                        onClick={() => setActiveTab("splits")}
                        className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition ${
                            activeTab === "splits"
                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                                : "text-slate-500"
                        }`}
                    >
                        Extra Expenses
                    </button>
                    <button
                        onClick={() => setActiveTab("breakdown")}
                        className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition ${
                            activeTab === "breakdown"
                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                                : "text-slate-500"
                        }`}
                    >
                        Breakdown
                    </button>
                </div>

                {/* ===================== TAB 1 - FIXED MONTHLY BILLS ===================== */}
                {activeTab === "fixed" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <div>
                                <h1 className="text-lg font-black text-slate-900 tracking-tight">
                                    Fixed Monthly Bills
                                </h1>
                                <p className="text-xs text-slate-400 font-medium">
                                    Shared overview for all 5 flatmates
                                </p>
                            </div>
                            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                Live Status
                            </span>
                        </div>

                        <div className="space-y-4">
                            {bills.map((bill) => {
                                const paidCount = Object.values(
                                    bill.statuses,
                                ).filter(Boolean).length;

                                return (
                                    <div
                                        key={bill.id}
                                        className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm space-y-3"
                                    >
                                        {/* Bill Title & Overall Collection Header */}
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl shadow-xs">
                                                    {bill.icon}
                                                </div>
                                                <div>
                                                    <h2 className="text-sm font-black text-slate-900">
                                                        {bill.title}
                                                    </h2>
                                                    <p className="text-[10px] text-slate-400 font-medium">
                                                        {bill.due} • Total: ৳
                                                        {bill.totalAmount.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                                {paidCount}/
                                                {FLAT_MEMBERS.length} Paid
                                            </span>
                                        </div>

                                        {/* Member Rows */}
                                        <div className="space-y-2 pt-1">
                                            {FLAT_MEMBERS.map((member) => {
                                                const isPaid =
                                                    bill.statuses[member.name];
                                                const isUserMe = isCurrentUser(
                                                    member.name,
                                                );
                                                const amount =
                                                    bill.perPerson ??
                                                    bill.customAmounts?.[
                                                        member.name
                                                    ] ??
                                                    0;

                                                return (
                                                    <div
                                                        key={member.name}
                                                        className="flex items-center justify-between py-2.5 px-3.5 rounded-2xl bg-slate-50 border border-slate-100/90"
                                                    >
                                                        {/* Member Name & Avatar */}
                                                        <div className="flex items-center gap-2.5 min-w-[110px]">
                                                            <img
                                                                src={
                                                                    member.avatar
                                                                }
                                                                alt={
                                                                    member.name
                                                                }
                                                                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                                            />
                                                            <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                                                {member.name}
                                                                {isUserMe && (
                                                                    <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                                                                        You
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>

                                                        {/* Bill Amount */}
                                                        <p className="text-xs font-black text-slate-800 tracking-tight">
                                                            ৳{amount}
                                                        </p>

                                                        {/* Status Badge / Restricted Pay Button */}
                                                        <div className="min-w-[85px] text-right">
                                                            {isPaid ? (
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl shadow-2xs">
                                                                    <span>
                                                                        ✓
                                                                    </span>{" "}
                                                                    Paid
                                                                </span>
                                                            ) : isUserMe ? (
                                                                <button
                                                                    onClick={() =>
                                                                        handlePayFixedBill(
                                                                            bill.id,
                                                                            member.name,
                                                                        )
                                                                    }
                                                                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-extrabold rounded-xl shadow-xs active:scale-95 transition"
                                                                >
                                                                    Pay Now 💳
                                                                </button>
                                                            ) : (
                                                                <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                                                                    Pending ⏳
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ===================== TAB 2 - EXTRA SHARED EXPENSES ===================== */}
                {activeTab === "splits" && (
                    <div className="space-y-4">
                        {/* Header Section with Add Expense Button */}
                        <div className="flex items-center justify-between px-1">
                            <div>
                                <h1 className="text-lg font-black text-slate-900 tracking-tight">
                                    Extra Shared Expenses
                                </h1>
                                <p className="text-xs text-slate-400 font-medium">
                                    Bazaar & daily splits
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddExpenseOpen(true)}
                                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-blue-600/20 active:scale-95 transition flex items-center gap-1.5"
                            >
                                <span>+</span> Add Expense
                            </button>
                        </div>

                        {/* Total Shared Month Banner */}
                        <div className="bg-[#0b132b] text-white rounded-[28px] p-5 shadow-lg border border-[#1e293b] flex items-center justify-between">
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                                    TOTAL SHARED THIS MONTH
                                </span>
                                <p className="text-2xl font-black text-white mt-0.5">
                                    ৳{totalSharedMonth.toLocaleString()}
                                </p>
                            </div>
                            <span className="bg-[#141e38] text-slate-300 border border-slate-700/60 px-3 py-1.5 rounded-2xl text-xs font-bold">
                                5 members split
                            </span>
                        </div>

                        {/* Expenses List */}
                        <div className="space-y-3">
                            {extraExpenses.length === 0 ? (
                                <div className="bg-white rounded-[28px] p-8 border border-slate-100 shadow-sm text-center space-y-2">
                                    <p className="text-2xl">💸</p>
                                    <p className="text-xs font-extrabold text-slate-800">
                                        No Extra Shared Expenses
                                    </p>
                                    <p className="text-[11px] text-slate-400 font-medium">
                                        Click Add Expense to create a new shared
                                        bazaar bill.
                                    </p>
                                </div>
                            ) : (
                                extraExpenses.map((exp) => {
                                    const paidMembersList = FLAT_MEMBERS.filter(
                                        (m) => exp.memberPaid[m.name],
                                    );

                                    return (
                                        <div
                                            key={exp.id}
                                            className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm space-y-3"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-900">
                                                        {exp.title}
                                                    </h3>
                                                    <p className="text-[11px] text-slate-400 font-medium">
                                                        Paid by {exp.payer} •{" "}
                                                        {exp.date}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-base font-black text-slate-900">
                                                        ৳{exp.totalAmount}
                                                    </p>
                                                    <p className="text-[10px] text-blue-600 font-bold">
                                                        ৳{exp.perPerson} /
                                                        person
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                                {/* Avatar Stack */}
                                                <div className="flex items-center -space-x-2">
                                                    {paidMembersList.length >
                                                    0 ? (
                                                        paidMembersList.map(
                                                            (m) => (
                                                                <img
                                                                    key={m.name}
                                                                    src={
                                                                        m.avatar
                                                                    }
                                                                    alt={m.name}
                                                                    className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-xs"
                                                                    title={`${m.name} Paid`}
                                                                />
                                                            ),
                                                        )
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                                                            No one paid yet
                                                        </span>
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedExpenseId(
                                                            exp.id,
                                                        );
                                                        setActiveTab(
                                                            "breakdown",
                                                        );
                                                    }}
                                                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 transition"
                                                >
                                                    View split breakdown{" "}
                                                    <span>›</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {/* ===================== TAB 3 - EXPENSE BREAKDOWN ===================== */}
                {activeTab === "breakdown" && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setActiveTab("splits")}
                                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-sm text-sm font-bold"
                            >
                                ←
                            </button>
                            <h1 className="text-base font-black text-slate-900">
                                Expense Split Breakdown
                            </h1>
                        </div>

                        {!selectedExpense ? (
                            <div className="bg-white rounded-[28px] p-8 border border-slate-100 shadow-sm text-center space-y-2">
                                <p className="text-xs font-bold text-slate-400">
                                    Select an expense from Extra Expenses tab to
                                    view breakdown.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Header Box */}
                                <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm text-center space-y-2">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        {selectedExpense.date}
                                    </span>
                                    <h2 className="text-lg font-black text-slate-900">
                                        {selectedExpense.title}
                                    </h2>
                                    <p className="text-3xl font-black text-slate-900">
                                        ৳{selectedExpense.totalAmount}
                                    </p>
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full inline-block border border-blue-100">
                                        ৳{selectedExpense.perPerson} each for{" "}
                                        {selectedExpense.membersCount} members
                                    </span>
                                </div>

                                {/* Member Payment Row Wise Status */}
                                <div className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm space-y-3">
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Member Payment Status
                                    </h3>

                                    <div className="space-y-3">
                                        {FLAT_MEMBERS.map((member) => {
                                            const isPaid =
                                                selectedExpense.memberPaid[
                                                    member.name
                                                ];
                                            const isUserMe = isCurrentUser(
                                                member.name,
                                            );

                                            return (
                                                <div
                                                    key={member.name}
                                                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                                                >
                                                    <div className="flex items-center gap-3 min-w-[120px]">
                                                        <img
                                                            src={member.avatar}
                                                            alt={member.name}
                                                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                                                        />
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                                                {member.name}{" "}
                                                                {isUserMe &&
                                                                    "(You)"}
                                                                {member.name ===
                                                                    selectedExpense.payer && (
                                                                    <span className="text-[9px] font-extrabold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                                                                        Payer
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <p className="text-xs font-extrabold text-slate-700">
                                                        ৳
                                                        {
                                                            selectedExpense.perPerson
                                                        }
                                                    </p>

                                                    <div>
                                                        {isPaid ? (
                                                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                                                                <span>✓</span>{" "}
                                                                Paid
                                                            </span>
                                                        ) : isUserMe ? (
                                                            <button
                                                                onClick={() =>
                                                                    handlePayExpenseSplit(
                                                                        selectedExpense.id,
                                                                        member.name,
                                                                    )
                                                                }
                                                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition"
                                                            >
                                                                Pay Share ✓
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                                                                Pending ⏳
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            <BottomNav />
        </main>
    );
}
