"use client";

export default function ExpenseSummary() {
    return (
        <div className="bg-linear-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl space-y-6 relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Bachelor Point
                    </p>
                    <h2 className="text-xl font-black tracking-tight mt-0.5">
                        October Summary
                    </h2>
                </div>
                <span className="text-xs bg-blue-500/30 text-blue-300 px-3 py-1 rounded-full font-medium border border-blue-500/30">
                    Live Status
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">
                        Total Mesh Expense
                    </p>
                    <h3 className="text-xl font-bold text-white mt-1">
                        ৳ 27,450
                    </h3>
                    <p className="text-[10px] text-emerald-400 mt-0.5">
                        Rent, WiFi & Bazaar
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">
                        Per Head Share
                    </p>
                    <h3 className="text-xl font-bold text-blue-400 mt-1">
                        ৳ 5,490
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                        Calculated for 5 members
                    </p>
                </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-medium">
                <span>
                    Settlement Status:{" "}
                    <strong className="text-amber-400">3 Pending</strong>
                </span>
                <span className="text-blue-400 hover:underline cursor-pointer">
                    View Details ›
                </span>
            </div>
        </div>
    );
}
