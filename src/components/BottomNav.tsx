"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/dashboard", icon: "🏠" },
        { name: "Tasks", href: "/tasks", icon: "📋" },
        { name: "Bills", href: "/bills", icon: "💳" },
        { name: "Expenses", href: "/expenses", icon: "💰" },
        { name: "Members", href: "/members", icon: "👥" }, // Added Members Link
        { name: "Profile", href: "/profile", icon: "👤" },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 py-2 px-4 z-50">
            <div className="max-w-md mx-auto flex justify-between items-center">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition ${
                                isActive
                                    ? "text-blue-600 font-bold scale-105"
                                    : "text-slate-400 hover:text-slate-600 font-medium"
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-[10px]">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
