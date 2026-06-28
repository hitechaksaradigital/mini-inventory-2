"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Products", icon: "inventory_2", href: "/" },
  { label: "Stock Movement", icon: "swap_horiz", href: "/stock-movement" },
  { label: "Reports", icon: "assessment", href: "/reports" },
  { label: "User Management", icon: "group", href: "/users" },
];

const bottomItems = [
  { label: "Settings", icon: "settings", href: "/settings" },
  { label: "Support", icon: "help", href: "/support" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-sidebar-width bg-on-background flex flex-col py-gutter z-50 shadow-md">
      <div className="px-6 mb-10">
        <h1 className="text-[20px] leading-[28px] font-bold text-white">
          StockFlow
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-outline-variant opacity-60">
          Enterprise Pro
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center px-6 py-3 transition-colors duration-200 ${
                isActive
                  ? "border-l-4 border-secondary-container bg-primary-container text-white"
                  : "text-outline-variant hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined mr-3">
                {item.icon}
              </span>
              <span className="text-[14px] leading-[20px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mb-6">
        <button className="w-full py-2 bg-secondary text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all hover:bg-secondary-container active:scale-95 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">
            qr_code_scanner
          </span>
          Quick Scan
        </button>
      </div>

      <div className="mt-auto border-t border-white/10 pt-4">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative flex items-center px-6 py-3 text-outline-variant hover:text-white hover:bg-white/5 transition-colors duration-200"
          >
            <span className="material-symbols-outlined mr-3">{item.icon}</span>
            <span className="text-[14px] leading-[20px]">{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
