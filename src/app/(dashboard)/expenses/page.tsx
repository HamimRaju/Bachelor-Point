"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";

export default function ExpensesPage() {
  const [activeTab, setActiveTab] = useState<"fixed" | "splits" | "breakdown">("splits");
  const [toast, setToast] = useState<string | null>(null);

  // Modal State for Adding Fixed Bill
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [newBillTitle, setNewBillTitle] = useState("");
  const [newBillAmount, setNewBillAmount] = useState("");
  const [newBillDue, setNewBillDue] = useState("");
  const [newBillIcon, setNewBillIcon] = useState("💡");

  // Modal State for Adding Extra Expense
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expensePayer, setExpensePayer] = useState("Radin");

  // Card 6: Fixed Monthly Bills State
  const [bills, setBills] = useState([
    { id: 1, title: "WiFi bill", due: "Due: 20 Oct 2026", amount: "৳1,000", paid: false, icon: "📶" },
    { id: 2, title: "Moyla bill", due: "Due: 15 Oct 2026", amount: "৳100", paid: false, icon: "🏠" },
    { id: 3, title: "Basha vara", due: "Due: 01 Nov 2026", amount: "৳20,000", paid: true, icon: "🏠" },
  ]);

  // Card 7: Extra Expenses & Splits State
  const [extraExpenses, setExtraExpenses] = useState([
    {
      id: 1,
      title: "Chal (Rice) & Extra Spices",
      payer: "Radin",
      date: "12 Oct 2026",
      totalAmount: 400,
      perPerson: 80,
      membersCount: 5,
    },
    {
      id: 2,
      title: "Water Jar Refill",
      payer: "Rubel",
      date: "10 Oct 2026",
      totalAmount: 250,
      perPerson: 50,
      membersCount: 5,
    },
  ]);

  // Card 8: Breakdown Member Payments State
  const [selectedExpense, setSelectedExpense] = useState(extraExpenses[0]);
  const [breakdownMembers, setBreakdownMembers] = useState([
    { name: "Radin", isPayer: true, share: 80, paid: true, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
    { name: "Rubel", isPayer: false, share: 80, paid: false, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
    { name: "Arefin", isPayer: false, share: 80, paid: false, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" },
    { name: "Real", isPayer: false, share: 80, paid: false, avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80" },
    { name: "Raju", isPayer: false, share: 80, paid: false, avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80" },
  ]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  // Total shared amount dynamic calculation
  const totalSharedMonth = extraExpenses.reduce((sum, exp) => sum + exp.totalAmount, 0);

  const handleMarkBillPaid = (id: number, title: string) => {
    setBills(bills.map(b => b.id === id ? { ...b, paid: true } : b));
    showToast(`${title} marked as Paid! 🎉`);
  };

  const handleAddBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBillTitle || !newBillAmount) {
      showToast("Please enter bill name and amount!");
      return;
    }

    const newBill = {
      id: Date.now(),
      title: newBillTitle,
      due: newBillDue ? `Due: ${newBillDue}` : "Due: Upcoming",
      amount: `৳${Number(newBillAmount).toLocaleString()}`,
      paid: false,
      icon: newBillIcon,
    };

    setBills([newBill, ...bills]);
    setIsAddBillOpen(false);
    setNewBillTitle("");
    setNewBillAmount("");
    setNewBillDue("");
    showToast(`Bill "${newBillTitle}" added successfully! 🚀`);
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) {
      showToast("Please enter title and amount!");
      return;
    }

    const total = Number(expenseAmount);
    const splitCount = 5;
    const perHead = Math.round(total / splitCount);

    const newExpense = {
      id: Date.now(),
      title: expenseTitle,
      payer: expensePayer,
      date: "Just now",
      totalAmount: total,
      perPerson: perHead,
      membersCount: splitCount,
    };

    setExtraExpenses([newExpense, ...extraExpenses]);
    setIsAddExpenseOpen(false);
    setExpenseTitle("");
    setExpenseAmount("");
    showToast(`Expense "${expenseTitle}" added & split equally! 💸`);
  };

  const handlePorisodh = (memberName: string) => {
    setBreakdownMembers(
      breakdownMembers.map(m => m.name === memberName ? { ...m, paid: true } : m)
    );
    showToast(`${memberName} er share porisodh kora hoyeche! ✅`);
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 pb-28 pt-4 px-4 font-sans relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 transition-all duration-300">
          <div className="px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border bg-emerald-950/90 border-emerald-500/50 text-emerald-300 shadow-emerald-900/50 text-xs font-bold">
            <span className="text-base">✅</span>
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Add Fixed Bill Modal */}
      {isAddBillOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 w-full max-w-sm space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Add New Monthly Bill</h3>
              <button 
                onClick={() => setIsAddBillOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBillSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Bill Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Electricity Bill, Gas Bill" 
                  value={newBillTitle}
                  onChange={(e) => setNewBillTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Amount (Tk)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 1500" 
                  value={newBillAmount}
                  onChange={(e) => setNewBillAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Due Date</label>
                <input 
                  type="text" 
                  placeholder="e.g. 25 Oct 2026" 
                  value={newBillDue}
                  onChange={(e) => setNewBillDue(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Select Icon</label>
                <div className="flex gap-2">
                  {["💡", "📶", "🏠", "💧", "🔥"].map((ico) => (
                    <button
                      type="button"
                      key={ico}
                      onClick={() => setNewBillIcon(ico)}
                      className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border transition ${
                        newBillIcon === ico ? "bg-blue-50 border-blue-600 shadow-sm scale-105" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      {ico}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-blue-600/30 transition active:scale-[0.98]"
                >
                  Save & Add Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Extra Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 w-full max-w-sm space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Add Extra Shared Expense</h3>
              <button 
                onClick={() => setIsAddExpenseOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Expense Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Chal (Rice), Oil, Spices" 
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Total Amount (Tk)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 500" 
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Who Paid?</label>
                <select 
                  value={expensePayer}
                  onChange={(e) => setExpensePayer(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                >
                  {["Radin", "Rubel", "Arefin", "Real", "Raju"].map((name) => (
                    <option key={name} value={name}>{name}</option>
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
        
        {/* Top Navigation Pills for Expenses Modules */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm gap-1">
          <button
            onClick={() => setActiveTab("fixed")}
            className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition ${
              activeTab === "fixed"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Fixed Bills
          </button>
          <button
            onClick={() => setActiveTab("splits")}
            className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition ${
              activeTab === "splits"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Extra Expenses
          </button>
          <button
            onClick={() => setActiveTab("breakdown")}
            className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition ${
              activeTab === "breakdown"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Breakdown
          </button>
        </div>

        {/* ======================================================== */}
        {/* CARD 6: STEP 2 - FIXED MONTHLY BILLS */}
        {/* ======================================================== */}
        {activeTab === "fixed" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight">Step 2: Fixed Monthly Bills</h1>
                <p className="text-xs text-slate-400 font-medium">Rent, WiFi & Utility dues</p>
              </div>
              <button
                onClick={() => setIsAddBillOpen(true)}
                className="w-9 h-9 bg-blue-50 text-blue-600 border border-blue-100 rounded-full font-bold flex items-center justify-center text-lg hover:bg-blue-100 transition shadow-sm active:scale-95"
              >
                +
              </button>
            </div>

            <div className="space-y-3">
              {bills.map((bill) => (
                <div key={bill.id} className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                        {bill.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{bill.title}</h3>
                        <p className="text-[11px] text-slate-400 font-medium">{bill.due}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-base font-black text-slate-900">{bill.amount}</p>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${
                        bill.paid ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        {bill.paid ? "Paid" : "Unpaid"}
                      </span>
                    </div>
                  </div>

                  {!bill.paid ? (
                    <button
                      onClick={() => handleMarkBillPaid(bill.id, bill.title)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-blue-600/20 active:scale-[0.98] transition"
                    >
                      Mark as Paid
                    </button>
                  ) : (
                    <div className="w-full py-2.5 bg-slate-50 text-slate-400 font-bold text-xs rounded-2xl text-center border border-slate-100 flex items-center justify-center gap-1">
                      <span>✓</span> Settle Completed
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* CARD 7: STEP 3 - EXPENSES & SPLIT */}
        {/* ======================================================== */}
        {activeTab === "splits" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight">Step 3: Extra Expenses</h1>
                <p className="text-xs text-slate-400 font-medium">Auto-split bazaar & shared costs</p>
              </div>
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-blue-600/20 active:scale-[0.98] transition flex items-center gap-1.5"
              >
                <span>+</span> Add Expense
              </button>
            </div>

            {/* Total Shared Card Banner */}
            <div className="bg-[#0b132b] text-white rounded-[28px] p-5 shadow-lg border border-[#1e293b] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  TOTAL SHARED THIS MONTH
                </span>
                <p className="text-2xl font-black text-white mt-0.5">৳{totalSharedMonth.toLocaleString()}</p>
              </div>
              <span className="bg-[#141e38] text-slate-300 border border-slate-700/60 px-3 py-1.5 rounded-2xl text-xs font-bold">
                5 people split
              </span>
            </div>

            {/* Expenses List */}
            <div className="space-y-3">
              {extraExpenses.map((exp) => (
                <div key={exp.id} className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{exp.title}</h3>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Paid by {exp.payer} • {exp.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-black text-slate-900">৳{exp.totalAmount}</p>
                      <p className="text-[10px] text-blue-600 font-bold">৳{exp.perPerson} / person</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex -space-x-1.5">
                      {["R", "R", "A", "R", "R"].map((initial, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                          {initial}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedExpense(exp);
                        setActiveTab("breakdown");
                      }}
                      className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1 transition"
                    >
                      View split breakdown <span>›</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* CARD 8: EXPENSE BREAKDOWN */}
        {/* ======================================================== */}
        {activeTab === "breakdown" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab("splits")}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-sm text-sm font-bold active:scale-95 transition"
              >
                ←
              </button>
              <h1 className="text-base font-black text-slate-900">Expense Split Details</h1>
            </div>

            {/* Header Amount Box */}
            <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm text-center space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{selectedExpense.date}</span>
              <h2 className="text-lg font-black text-slate-900">{selectedExpense.title}</h2>
              <p className="text-3xl font-black text-slate-900">৳{selectedExpense.totalAmount}</p>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full inline-block border border-blue-100">
                ৳{selectedExpense.perPerson} each for {selectedExpense.membersCount} members
              </span>
            </div>

            {/* Member Payment Status List */}
            <div className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Split Status</h3>

              <div className="space-y-3">
                {breakdownMembers.map((member) => (
                  <div key={member.name} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          {member.name}
                          {member.isPayer && (
                            <span className="text-[9px] font-extrabold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                              Payer
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">Share: ৳{selectedExpense.perPerson}</p>
                      </div>
                    </div>

                    <div>
                      {member.paid ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100">
                          <span>✓</span> Paid ৳{selectedExpense.perPerson}
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePorisodh(member.name)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition"
                        >
                          Porisodh Kurun
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      <BottomNav />
    </main>
  );
}