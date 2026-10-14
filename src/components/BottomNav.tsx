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
    { name: "Members", href: "/members", icon: "👥" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#070b19]/95 backdrop-blur-md border-t border-[#1e293b]/80 py-2.5 px-4 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive 
                  ? "text-blue-400 font-bold scale-105" 
                  : "text-slate-400 font-medium hover:text-slate-200"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-[10px] tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}