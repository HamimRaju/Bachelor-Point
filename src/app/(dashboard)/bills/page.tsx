"use client";

import { useState } from "react";
import { markBillAsPaid } from "@/actions/bill.actions";

interface BillItem {
    id: string;
    title: string;
    totalAmount: number;
    dueDate: string;
    status: "Unpaid" | "Overdue" | "Paid";
    icon: string;
}

const INITIAL_BILLS: BillItem[] = [
    {
        id: "1",
        title: "WiFi bill",
        totalAmount: 1200,
        dueDate: "Oct 10",
        status: "Unpaid",
        icon: "📶",
    },
    {
        id: "2",
        title: "Moyla bill",
        totalAmount: 100,
        dueDate: "Oct 05",
        status: "Overdue",
        icon: "🗑️",
    },
    {
        id: "3",
        title: "Basha vara",
        totalAmount: 20000,
        dueDate: "Oct 01",
        status: "Paid",
        icon: "🏠",
    },
];

export default function BillsPage() {
    const [bills, setBills] = useState<BillItem[]>(INITIAL_BILLS);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handlePay = async (id: string) => {
        setLoadingId(id);
        try {
            const dummyUserId = "650000000000000000000001";
            await markBillAsPaid(id, dummyUserId);
        } catch {
            // Local optimistic state fallback
            setBills((prev) =>
                prev.map((b) => (b.id === id ? { ...b, status: "Paid" } : b)),
            );
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-24 pt-6 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">
                        Step 2: Fixed Bills
                    </h1>
                    <p className="text-xs text-slate-500">
                        মাসিক নির্ধারিত বিল ও বাসা ভাড়া
                    </p>
                </div>
                <button className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md shadow-blue-600/30">
                    +
                </button>
            </div>

            {/* Bill List Cards */}
            <div className="space-y-4">
                {bills.map((bill) => (
                    <div
                        key={bill.id}
                        className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                                    {bill.icon}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        {bill.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Due: {bill.dueDate}
                                    </p>
                                </div>
                            </div>
                            <span
                                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                                    bill.status === "Paid"
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                        : bill.status === "Overdue"
                                          ? "bg-amber-50 text-amber-600 border border-amber-200"
                                          : "bg-rose-50 text-rose-600 border border-rose-200"
                                }`}
                            >
                                {bill.status}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                            <span>
                                Total:{" "}
                                <strong className="text-slate-900">
                                    ৳ {bill.totalAmount.toLocaleString()}
                                </strong>
                            </span>
                            <span>
                                Per Person:{" "}
                                <strong className="text-slate-900">
                                    ৳ {(bill.totalAmount / 5).toLocaleString()}
                                </strong>
                            </span>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => handlePay(bill.id)}
                            disabled={
                                bill.status === "Paid" || loadingId === bill.id
                            }
                            className={`w-full py-3 rounded-xl font-medium text-xs transition duration-200 shadow-sm ${
                                bill.status === "Paid"
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-[0.98]"
                            }`}
                        >
                            {bill.status === "Paid"
                                ? "Marked as Paid ✓"
                                : loadingId === bill.id
                                  ? "Updating..."
                                  : "Mark as Paid"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
