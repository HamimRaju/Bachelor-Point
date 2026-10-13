import Link from "next/link";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Main Content Area */}
            <main className="max-w-md mx-auto">{children}</main>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-slate-200 px-6 py-2 flex items-center justify-between z-50 shadow-lg">
                <Link
                    href="/dashboard"
                    className="flex flex-col items-center text-slate-600 hover:text-blue-600 transition"
                >
                    <span className="text-xl">🏠</span>
                    <span className="text-[10px] font-medium mt-0.5">Home</span>
                </Link>
                <Link
                    href="/tasks"
                    className="flex flex-col items-center text-slate-600 hover:text-blue-600 transition"
                >
                    <span className="text-xl">📋</span>
                    <span className="text-[10px] font-medium mt-0.5">
                        Tasks
                    </span>
                </Link>
                <Link
                    href="/bills"
                    className="flex flex-col items-center text-slate-600 hover:text-blue-600 transition"
                >
                    <span className="text-xl">💳</span>
                    <span className="text-[10px] font-medium mt-0.5">
                        Bills
                    </span>
                </Link>
                <Link
                    href="/expenses"
                    className="flex flex-col items-center text-slate-600 hover:text-blue-600 transition"
                >
                    <span className="text-xl">💰</span>
                    <span className="text-[10px] font-medium mt-0.5">
                        Expenses
                    </span>
                </Link>
            </nav>
        </div>
    );
}
