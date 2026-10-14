"use client";

import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28 pt-4 px-4 font-sans">
      <div className="max-w-md mx-auto space-y-5">
        
        {/* Top Header Profile & Notification */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm bg-slate-200">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                alt="Radin" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                Good morning, Radin 👋
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">Flat Admin • Block B, House 14</p>
            </div>
          </div>

          <button 
            type="button" 
            className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition shadow-sm"
          >
            🔔
          </button>
        </div>

        {/* Main Blue Banner Card */}
        <div className="bg-blue-600 text-white rounded-[28px] p-6 shadow-xl shadow-blue-600/20 relative overflow-hidden">
          <span className="text-[10px] uppercase font-extrabold tracking-widest bg-white/20 px-3 py-1 rounded-full text-white inline-block">
            BACHELOR POINT
          </span>
          <h3 className="text-lg font-bold mt-3 leading-snug">
            Together we manage, better we live.
          </h3>

          <div className="flex justify-between items-end mt-6 pt-2 border-t border-white/10">
            <div>
              <p className="text-sm font-black text-white">5 Active</p>
              <p className="text-[11px] text-blue-100 font-medium">Members</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-black tracking-tight text-white">৳2,450 <span className="text-xs font-normal text-blue-100">Month</span></p>
              <p className="text-[11px] text-blue-100 font-medium">Total</p>
            </div>
          </div>
        </div>

        {/* Today's Tasks Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Todays Tasks</h3>
            <Link href="/tasks" className="text-xs font-bold text-blue-600 hover:underline">View all</Link>
          </div>

          <div className="bg-white rounded-[28px] p-4 border border-slate-100 shadow-sm space-y-3">
            {/* Active Highlighted Task */}
            <div className="bg-blue-50/80 rounded-2xl p-3.5 flex items-center justify-between border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                  ✨
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Washroom Clean</h4>
                  <p className="text-[10px] text-blue-600 font-semibold">Your turn today!</p>
                </div>
              </div>
              <button 
                type="button"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95"
              >
                Done
              </button>
            </div>

            {/* Other Pending Tasks */}
            <Link href="/tasks" className="flex items-center justify-between py-2 px-2 hover:bg-slate-50 rounded-2xl transition block">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-sm">
                  🛒
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Polythene kena</h4>
                  <p className="text-[10px] text-slate-400">Rubels turn</p>
                </div>
              </div>
              <span className="text-slate-300 text-sm">›</span>
            </Link>

            <Link href="/tasks" className="flex items-center justify-between py-2 px-2 hover:bg-slate-50 rounded-2xl transition block">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-sm">
                  🛒
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Vimbar kena</h4>
                  <p className="text-[10px] text-slate-400">Arefins turn</p>
                </div>
              </div>
              <span className="text-slate-300 text-sm">›</span>
            </Link>
          </div>
        </div>

        {/* Pending Extra Splits Section */}
        <div className="flex items-center justify-between pt-1 px-1">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pending Extra Splits</h3>
          <Link href="/expenses" className="text-xs font-bold text-blue-600 hover:underline">Details</Link>
        </div>

      </div>

      {/* Persistent Bottom Nav */}
      <BottomNav />
    </div>
  );
}