"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-24 pt-4 px-4 space-y-5">
      {/* Header Profile Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm bg-slate-200">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
              alt="User" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1">
              Good morning, Radin 👋
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">Flat Admin • Block B, House 14</p>
          </div>
        </div>

        <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition">
          🔔
        </button>
      </div>

      {/* Main Banner Card */}
      <div className="bg-linear-to-br from-blue-600 to-blue-700 text-white rounded-3xl p-6 shadow-xl shadow-blue-600/20 relative overflow-hidden">
        <span className="text-[10px] uppercase font-extrabold tracking-widest bg-white/20 px-3 py-1 rounded-full text-white">
          BACHELOR POINT
        </span>
        <h3 className="text-lg font-bold mt-3 leading-snug">
          Together we manage, better we live.
        </h3>

        <div className="flex justify-between items-end mt-6 pt-2">
          <div>
            <p className="text-[11px] text-blue-100 font-semibold">5 Active</p>
            <p className="text-xs font-bold text-white">Members</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black tracking-tight text-white">৳2,450 <span className="text-xs font-normal text-blue-100">Month</span></p>
            <p className="text-[11px] text-blue-100 font-semibold">Total</p>
          </div>
        </div>
      </div>

      {/* Today's Tasks Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Todays Tasks</h3>
          <Link href="/tasks" className="text-xs font-bold text-blue-600 hover:underline">View all</Link>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-3">
          {/* Active Highlighted Task */}
          <div className="bg-blue-50/70 rounded-2xl p-3.5 flex items-center justify-between border border-blue-100">
            <div className="flex items-center gap-3">
              <span className="text-blue-600 text-lg">✨</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Washroom Clean</h4>
                <p className="text-[10px] text-blue-600 font-semibold">Your turn today!</p>
              </div>
            </div>
            <button className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-700">
              Done
            </button>
          </div>

          {/* Other Pending Tasks */}
          <div className="flex items-center justify-between py-1 px-1">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-base">🛒</span>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Polythene kena</h4>
                <p className="text-[10px] text-slate-400">Rubels turn</p>
              </div>
            </div>
            <span className="text-slate-300">›</span>
          </div>

          <div className="flex items-center justify-between py-1 px-1">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-base">🛒</span>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Vimbar kena</h4>
                <p className="text-[10px] text-slate-400">Arefins turn</p>
              </div>
            </div>
            <span className="text-slate-300">›</span>
          </div>
        </div>
      </div>

      {/* Pending Extra Splits Section */}
      <div className="flex items-center justify-between pt-1">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pending Extra Splits</h3>
        <Link href="/expenses" className="text-xs font-bold text-blue-600 hover:underline">Details</Link>
      </div>
    </div>
  );
}