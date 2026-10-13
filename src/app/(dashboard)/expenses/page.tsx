"use client";

import { useState } from "react";
import { settleExpenseShare } from "../../../../actions/expense.actions";

interface SplitMember {
    id: string;
    name: string;
    amount: number;
    status: "Pending" | "Paid";
}

interface ExpenseItem {
    id: string;
    title: string;
    totalAmount: number;
    paidBy: string;
    shares: SplitMember[];
}

const INITIAL_EXPENSES: ExpenseItem[] = [
    {
        id: "1",
        title: "Chal kena (1kg)",
        totalAmount: 400,
        paidBy: "Raju",
        shares: [
            { id: "m1", name: "Rahim", amount: 80, status: "Pending" },
            { id: "m2", name: "Karim", amount: 80, status: "Pending" },
            { id: "m3", name: "Shumi", amount: 80, status: "Paid" },
            { id: "m4", name: "Tanvir", amount: 80, status: "Pending" },
        ],
    },
];

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
    const [notifications, setNotifications] = useState<string[]>([
        "Shumi paid Tk 80 to you for Chal kena",
    ]);

    const handlePorisodh = async (
        expenseId: string,
        memberId: string,
        memberName: string,
        amount: number,
    ) => {
        try {
            await settleExpenseShare(expenseId, memberId);
        } catch {
            // Fallback local UI update
            setExpenses((prev) =>
                prev.map((exp) => {
                    if (exp.id === expenseId) {
                        return {
                            ...exp,
                            shares: exp.shares.map((s) =>
                                s.id === memberId
                                    ? { ...s, status: "Paid" as const }
                                    : s,
                            ),
                        };
                    }
                    return exp;
                }),
            );
            setNotifications((prev) => [
                `${memberName} paid Tk ${amount} to you.`,
                ...prev,
            ]);
        }
    };

    return (
        <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-24 pt-6 px-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">
                        Step 3: Extra Expenses
                    </h1>
                    <p className="text-xs text-slate-500">
                        কাস্টম বাজার ও রিসিভ হিসাব
                    </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30 hover:bg-blue-700 transition">
                    + Add Expense
                </button>
            </div>

            {/* Live Notifications Banner */}
            {notifications.length > 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                            🔔 Recent Notifications
                        </span>
                        <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">
                            Live
                        </span>
                    </div>
                    <div className="space-y-1">
                        {notifications.map((notif, idx) => (
                            <p
                                key={idx}
                                className="text-xs text-blue-800 font-medium"
                            >
                                • {notif}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {/* Total Owed Summary Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        You Will Get Total
                    </p>
                    <h2 className="text-2xl font-black text-slate-900 mt-1">
                        ৳ 320
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                        Split across 4 members (৳ 80 each)
                    </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold shadow-inner">
                    💰
                </div>
            </div>

            {/* Expense Split Items List */}
            <div className="space-y-4">
                {expenses.map((expense) => (
                    <div
                        key={expense.id}
                        className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    {expense.title}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Paid by You • Total: ৳ {expense.totalAmount}
                                </p>
                            </div>
                            <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                                5 Split
                            </span>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-100">
                            {expense.shares.map((share) => (
                                <div
                                    key={share.id}
                                    className="flex items-center justify-between py-1.5"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 font-bold text-slate-600 text-xs flex items-center justify-center">
                                            {share.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-semibold text-slate-900">
                                                {share.name}
                                            </h4>
                                            <p className="text-[10px] text-slate-400">
                                                Owes: ৳ {share.amount}
                                            </p>
                                        </div>
                                    </div>

                                    {share.status === "Paid" ? (
                                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                                            ✓ Porisodhito
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                handlePorisodh(
                                                    expense.id,
                                                    share.id,
                                                    share.name,
                                                    share.amount,
                                                )
                                            }
                                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-sm transition active:scale-95"
                                        >
                                            Porisodh Korun
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
