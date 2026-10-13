import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-24 pt-6 px-4 space-y-6">
            {/* Top Header Profile & Notifications */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm">
                        RA
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">
                            Sheikh Raju
                        </h2>
                        <p className="text-[11px] text-slate-400">
                            Flat No: 3B • Bachelor Point
                        </p>
                    </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer">
                    🔔
                </div>
            </div>

            {/* Quick Summary Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
                <Link
                    href="/bills"
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition"
                >
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">
                        Fixed Bills
                    </p>
                    <h3 className="text-lg font-black text-slate-900 mt-1">
                        2 / 3 Paid
                    </h3>
                    <p className="text-[10px] text-emerald-600 mt-0.5">
                        WiFi & Rent status
                    </p>
                </Link>
                <Link
                    href="/expenses"
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition"
                >
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">
                        You Will Get
                    </p>
                    <h3 className="text-lg font-black text-blue-600 mt-1">
                        ৳ 320
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                        From 4 members
                    </p>
                </Link>
            </div>

            {/* Active Queue Task Banner */}
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-600/20 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                        Your Turn Today
                    </span>
                    <span className="text-xs">🛒 Shopping</span>
                </div>
                <div>
                    <h3 className="text-lg font-bold">Lobon kena (1kg)</h3>
                    <p className="text-xs text-blue-100 mt-0.5">
                        Please buy this item before evening.
                    </p>
                </div>
                <div className="flex gap-2 pt-1">
                    <Link
                        href="/tasks"
                        className="flex-1 py-2 bg-white text-blue-600 font-semibold text-xs rounded-xl text-center shadow-sm hover:bg-blue-50 transition"
                    >
                        Mark as Kinlam ✓
                    </Link>
                </div>
            </div>

            {/* Quick Access Modules */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                    Quick Navigation
                </h3>

                <div className="grid grid-cols-3 gap-3">
                    <Link
                        href="/tasks"
                        className="bg-white p-4 rounded-2xl border border-slate-100 text-center hover:shadow-md transition"
                    >
                        <span className="text-2xl">📋</span>
                        <h4 className="text-xs font-bold text-slate-800 mt-2">
                            Queue Tasks
                        </h4>
                    </Link>
                    <Link
                        href="/bills"
                        className="bg-white p-4 rounded-2xl border border-slate-100 text-center hover:shadow-md transition"
                    >
                        <span className="text-2xl">💳</span>
                        <h4 className="text-xs font-bold text-slate-800 mt-2">
                            Fixed Bills
                        </h4>
                    </Link>
                    <Link
                        href="/expenses"
                        className="bg-white p-4 rounded-2xl border border-slate-100 text-center hover:shadow-md transition"
                    >
                        <span className="text-2xl">💰</span>
                        <h4 className="text-xs font-bold text-slate-800 mt-2">
                            Split Bazaar
                        </h4>
                    </Link>
                </div>
            </div>
        </div>
    );
}
