"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "হোম", href: "/", icon: "home" },
  { name: "কাজ", href: "/tasks", icon: "tasks" },
  { name: "খরচ", href: "/expenses", icon: "expenses" },
  { name: "সদস্য", href: "/members", icon: "members" },
  { name: "আরও", href: "/more", icon: "more" },
] as const;

type NavIconName = (typeof navItems)[number]["icon"];

function NavIcon({ name }: { name: NavIconName }) {
  const commonProps = {
    "aria-hidden": true as const,
    className: "h-5 w-5 shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };

  switch (name) {
    case "home":
      return (
        <svg {...commonProps}>
          <path d="m3.5 10 8.5-7 8.5 7" />
          <path d="M5.5 9v10.5a1 1 0 0 0 1 1h4v-6h3v6h4a1 1 0 0 0 1-1V9" />
        </svg>
      );
    case "tasks":
      return (
        <svg {...commonProps}>
          <rect x="4" y="3.5" width="16" height="17" rx="3" />
          <path d="m8 11.5 2.2 2.2 5-5M8 7.5h2M8 17h8" />
        </svg>
      );
    case "expenses":
      return (
        <svg {...commonProps}>
          <path d="M4 6.5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2h12" />
          <path d="M20 11h-4a2 2 0 0 0 0 4h4M16 13h.01" />
        </svg>
      );
    case "members":
      return (
        <svg {...commonProps}>
          <path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20" />
          <circle cx="9.5" cy="7.5" r="3.5" />
          <path d="M17 11a3.5 3.5 0 1 0-1-6.85M21 20v-1.5a4 4 0 0 0-3-3.87" />
        </svg>
      );
    case "more":
      return (
        <svg {...commonProps}>
          <circle cx="5" cy="12" r="1.2" />
          <circle cx="12" cy="12" r="1.2" />
          <circle cx="19" cy="12" r="1.2" />
        </svg>
      );
  }
}

function BottomNavContent() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] sm:px-4">
      <nav
        aria-label="প্রধান নেভিগেশন"
        className="glass-nav w-full max-w-[34rem] rounded-3xl px-1 py-1.5"
      >
        <div className="flex items-stretch gap-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/" && pathname === "/dashboard") ||
              (item.href === "/more" && pathname === "/profile") ||
              (item.href === "/tasks" && pathname.startsWith("/tasks"));

            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`pointer-events-auto group flex min-h-[3.5rem] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-0.5 text-[10px] transition-colors duration-150 active:scale-[0.97] motion-reduce:transition-none sm:min-h-[3.75rem] sm:text-[11px] ${
                  isActive
                    ? "nav-active font-extrabold"
                    : "font-semibold text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="transition-transform duration-200 ease-out group-hover:-translate-y-px motion-reduce:transition-none">
                  <NavIcon name={item.icon} />
                </span>
                <span className="truncate tracking-tight">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function BottomNav() {
  return (
    <Suspense fallback={null}>
      <BottomNavContent />
    </Suspense>
  );
}
