"use client";

import { useState } from "react";
import { markBillAsPaid } from "@/actions/bill.actions";
import { PageFrame, Pill, SectionHeading, SurfaceCard } from "@/components/ui";

interface BillItem {
  id: string;
  title: string;
  totalAmount: number;
  dueDate: string;
  status: "Unpaid" | "Overdue" | "Paid";
  icon: string;
}

const INITIAL_BILLS: BillItem[] = [
  { id: "1", title: "WiFi bill", totalAmount: 1200, dueDate: "Oct 10", status: "Unpaid", icon: "W" },
  { id: "2", title: "Moyla bill", totalAmount: 100, dueDate: "Oct 05", status: "Overdue", icon: "M" },
  { id: "3", title: "Basha vara", totalAmount: 20000, dueDate: "Oct 01", status: "Paid", icon: "B" },
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
      setBills((current) => current.map((bill) => bill.id === id ? { ...bill, status: "Paid" } : bill));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <PageFrame>
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#46F0D2]">Bachelor Point · Flat 3B</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Fixed bills</h1>
          <p className="mt-1 text-sm text-white/65">Monthly bills and household costs.</p>
        </div>
        <Pill tone="gold">Monthly</Pill>
      </header>
      <SectionHeading title="Bill overview" subtitle="Your shared payments in one place." />
      <div className="space-y-3">
        {bills.map((bill) => (
          <SurfaceCard key={bill.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="gradient-panel flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white">{bill.icon}</div>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold">{bill.title}</h2>
                  <p className="mt-1 text-xs text-[#131321]/60">Due {bill.dueDate}</p>
                </div>
              </div>
              <Pill tone={bill.status === "Paid" ? "cyan" : "gold"}>{bill.status}</Pill>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[#131321]/10 pt-3 text-xs">
              <span className="text-[#131321]/60">Total <strong className="ml-1 text-[#131321]">৳{bill.totalAmount.toLocaleString()}</strong></span>
              <span className="text-[#131321]/60">Per person <strong className="ml-1 text-[#131321]">৳{(bill.totalAmount / 5).toLocaleString()}</strong></span>
            </div>
            <button type="button" onClick={() => void handlePay(bill.id)} disabled={bill.status === "Paid" || loadingId === bill.id} className="mt-4 w-full rounded-full bg-[#46F0D2] py-3 text-xs font-bold text-[#131321] disabled:cursor-not-allowed disabled:opacity-50">
              {bill.status === "Paid" ? "Marked as Paid ✓" : loadingId === bill.id ? "Updating…" : "Mark as Paid"}
            </button>
          </SurfaceCard>
        ))}
      </div>
    </PageFrame>
  );
}
