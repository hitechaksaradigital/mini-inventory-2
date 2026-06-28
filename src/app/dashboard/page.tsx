"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "@/components/Sidebar";
import type { Product } from "@/db/schema";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [criticalProducts, setCriticalProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { count: totalCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });
        setTotalProducts(totalCount || 0);

        const { count: lowCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .gt("stock_level", 0)
          .lt("stock_level", 20);
        setLowStockCount(lowCount || 0);

        const { count: outCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("stock_level", 0);
        setOutOfStockCount(outCount || 0);

        const { data: criticalData } = await supabase
          .from("products")
          .select("*")
          .or("stock_level.eq.0,stock_level.lt.20")
          .order("stock_level", { ascending: true })
          .limit(10);

        if (criticalData) {
          setCriticalProducts(
            criticalData.map((p) => ({
              id: p.id,
              name: p.name,
              sku: p.sku,
              category: p.category,
              stockLevel: p.stock_level,
              maxStock: p.max_stock,
              buyPrice: p.buy_price,
              sellPrice: p.sell_price,
              icon: p.icon,
              description: p.description,
              createdAt: p.created_at,
              updatedAt: p.updated_at,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const getStockStatus = (stockLevel: number) => {
    if (stockLevel === 0) return { label: "Out of Stock", className: "bg-error-container text-on-error-container" };
    return { label: `${stockLevel} units`, className: "bg-error-container text-on-error-container" };
  };

  return (
    <div className="flex min-h-screen bg-surface overflow-x-hidden">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-sidebar-width min-h-screen flex flex-col w-full">
        {/* Top Navigation Bar */}
        <header className="flex justify-between items-center w-full px-gutter h-16 bg-surface border-b border-outline-variant z-40 max-w-container-max">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-secondary transition-colors">
                search
              </span>
              <input
                className="bg-surface-container-low border-none focus:ring-2 focus:ring-secondary/20 text-[14px] leading-[20px] w-72 pl-10 rounded-full transition-all"
                placeholder="Search stock, movements, logs..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-95 relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            </button>
            <div className="h-8 w-[1px] bg-outline-variant"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-semibold leading-none text-on-surface group-hover:text-secondary transition-colors">
                  Inventory Manager
                </p>
                <p className="text-[10px] text-on-surface-variant uppercase font-bold mt-1">
                  Admin Level
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-secondary/20 bg-secondary-fixed flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  person
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-gutter space-y-gutter pb-12">
          {/* Page Header Area */}
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-[24px] sm:text-[30px] leading-[32px] sm:leading-[38px] font-semibold tracking-tight text-primary">
                Dashboard Overview
              </h2>
              <p className="text-on-surface-variant text-[14px] leading-[20px] mt-1">
                Real-time inventory analysis and operational summary.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-surface-container-highest text-on-surface text-sm font-semibold rounded-lg hover:bg-surface-dim transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">
                  file_download
                </span>
                Export Data
              </button>
              <button className="px-4 py-2 bg-secondary text-white text-sm font-semibold rounded-lg hover:brightness-110 shadow-lg shadow-secondary/10 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">
                  add_circle
                </span>
                New Entry
              </button>
            </div>
          </div>

          {/* Bento Grid - Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Total Products */}
            <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-[120px] text-primary">
                  inventory_2
                </span>
              </div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">inventory</span>
                </div>
                <span className="text-xs font-bold text-tertiary-container bg-tertiary-fixed py-1 px-2 rounded-full">
                  +12.5%
                </span>
              </div>
              <h3 className="text-on-surface-variant text-[12px] leading-[16px] tracking-[0.05em] font-bold uppercase mb-1">
                Total Products
              </h3>
              {loading ? (
                <div className="h-[38px] w-24 bg-surface-container-high rounded animate-pulse" />
              ) : (
                <p className="text-[24px] sm:text-[30px] leading-[32px] sm:leading-[38px] font-bold tracking-tight text-primary">
                  {totalProducts.toLocaleString()}
                </p>
              )}
              <p className="text-[14px] leading-[20px] text-outline mt-4 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">update</span>{" "}
                Updated just now
              </p>
            </div>

            {/* Low Stock Alert */}
            <div className="glass-card p-6 rounded-xl relative overflow-hidden group bg-gradient-to-br from-white to-surface-container-low">
              <div className="absolute right-0 top-0 w-1.5 h-full bg-error"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center text-error">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <button className="text-error font-semibold text-xs hover:underline">
                  View All
                </button>
              </div>
              <h3 className="text-on-surface-variant text-[12px] leading-[16px] tracking-[0.05em] font-bold uppercase mb-1">
                Low Stock Items
              </h3>
              {loading ? (
                <div className="h-[38px] w-16 bg-surface-container-high rounded animate-pulse" />
              ) : (
                <p className="text-[24px] sm:text-[30px] leading-[32px] sm:leading-[38px] font-bold tracking-tight text-error">
                  {lowStockCount}
                </p>
              )}
              <div className="mt-4 flex -space-x-2">
                <div className="w-7 h-7 rounded-full border-2 border-white bg-error-container flex items-center justify-center text-on-error-container text-[10px] font-bold">
                  +{Math.max(0, lowStockCount - 1)}
                </div>
              </div>
            </div>

            {/* Out of Stock */}
            <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-outline-variant/20 flex items-center justify-center text-outline">
                  <span className="material-symbols-outlined">error_outline</span>
                </div>
                <span className="text-xs font-bold text-error bg-error-container py-1 px-2 rounded-full">
                  Critical
                </span>
              </div>
              <h3 className="text-on-surface-variant text-[12px] leading-[16px] tracking-[0.05em] font-bold uppercase mb-1">
                Out of Stock
              </h3>
              {loading ? (
                <div className="h-[38px] w-16 bg-surface-container-high rounded animate-pulse" />
              ) : (
                <p className="text-[24px] sm:text-[30px] leading-[32px] sm:leading-[38px] font-bold tracking-tight text-on-background">
                  {outOfStockCount}
                </p>
              )}
              <p className="text-[14px] leading-[20px] text-outline mt-4">
                Immediate replenishment required.
              </p>
            </div>
          </div>

          {/* Dashboard Analytics & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter h-[450px]">
            {/* Stock Movement Graph */}
            <div className="lg:col-span-2 glass-card p-6 rounded-xl flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-[20px] leading-[28px] font-semibold">
                    Stock Movement Flow
                  </h3>
                  <p className="text-on-surface-variant text-[14px] leading-[20px]">
                    Weekly inflow vs. outflow analytics
                  </p>
                </div>
                <select className="bg-surface-container-low border-outline-variant rounded-lg text-xs font-semibold focus:ring-secondary/20">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              {/* Simplified Visual Graph Area */}
              <div className="flex-grow relative mt-4">
                {/* Simulated Graph Background Grid */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  <div className="w-full h-[1px] bg-outline-variant/30"></div>
                  <div className="w-full h-[1px] bg-outline-variant/30"></div>
                  <div className="w-full h-[1px] bg-outline-variant/30"></div>
                  <div className="w-full h-[1px] bg-outline-variant/30"></div>
                  <div className="w-full h-[1px] bg-outline-variant/30"></div>
                </div>
                {/* Visual representation of an area chart using SVG */}
                <div className="absolute inset-0 pt-4 flex items-end">
                  <svg
                    className="w-full h-full"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                  >
                    <defs>
                      <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#2170e4" stopOpacity="0.2" />
                        <stop
                          offset="100%"
                          stopColor="#2170e4"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,80 Q10,75 20,40 T40,50 T60,20 T80,30 T100,10 L100,100 L0,100 Z"
                      fill="url(#chartGradient)"
                    />
                    <path
                      d="M0,80 Q10,75 20,40 T40,50 T60,20 T80,30 T100,10"
                      fill="none"
                      stroke="#2170e4"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                {/* Graph Labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between pt-4 -mb-6 text-[10px] font-bold text-outline uppercase tracking-wider">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>

            {/* Recent Activity Log */}
            <div className="glass-card p-6 rounded-xl flex flex-col overflow-hidden">
              <h3 className="text-[20px] leading-[28px] font-semibold mb-4">
                Recent Activity
              </h3>
              <div className="flex-grow overflow-y-auto custom-scrollbar space-y-4">
                {/* Log Entry: Stock In */}
                <div className="flex gap-4 group cursor-default">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">
                      south_east
                    </span>
                  </div>
                  <div className="flex-grow border-b border-outline-variant/30 pb-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-on-surface">
                        Stock In: MacBook Pro
                      </h4>
                      <span className="text-[10px] font-medium text-outline">
                        12m ago
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      +50 units added to Warehouse A
                    </p>
                  </div>
                </div>

                {/* Log Entry: Stock Out */}
                <div className="flex gap-4 group cursor-default">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">
                      north_east
                    </span>
                  </div>
                  <div className="flex-grow border-b border-outline-variant/30 pb-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-on-surface">
                        Stock Out: Dell XPS 13
                      </h4>
                      <span className="text-[10px] font-medium text-outline">
                        45m ago
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      -12 units shipped (Order #8921)
                    </p>
                  </div>
                </div>

                {/* Log Entry: Stock Out */}
                <div className="flex gap-4 group cursor-default">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">
                      north_east
                    </span>
                  </div>
                  <div className="flex-grow border-b border-outline-variant/30 pb-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-on-surface">
                        Stock Out: iPhone 15 Pro
                      </h4>
                      <span className="text-[10px] font-medium text-outline">
                        2h ago
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      -5 units shipped (Order #8918)
                    </p>
                  </div>
                </div>

                {/* Log Entry: Low Stock Alert */}
                <div className="flex gap-4 group cursor-default">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-error-container flex items-center justify-center text-error group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">
                      priority_high
                    </span>
                  </div>
                  <div className="flex-grow border-b border-outline-variant/30 pb-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-on-surface">
                        Critical: Sony WH-1000XM5
                      </h4>
                      <span className="text-[10px] font-medium text-outline">
                        3h ago
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Stock below threshold (2 units left)
                    </p>
                  </div>
                </div>
              </div>
              <button className="mt-4 w-full py-2 text-xs font-bold text-secondary hover:bg-secondary/5 rounded-lg transition-colors">
                See Detailed Logs
              </button>
            </div>
          </div>

          {/* Quick Table Section */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center bg-surface-container-low border-b border-outline-variant">
              <h3 className="text-[20px] leading-[28px] font-semibold">
                Critical Stock List
              </h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-outline-variant rounded-md text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  Low Stock Items
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-highest/50">
                    <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Threshold
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <span className="material-symbols-outlined animate-spin text-secondary text-[32px]">
                            progress_activity
                          </span>
                          <p className="text-on-surface-variant text-[14px]">
                            Loading critical stock...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : criticalProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant text-[14px]">
                        No critical stock items found.
                      </td>
                    </tr>
                  ) : (
                    criticalProducts.map((product) => {
                      const status = getStockStatus(product.stockLevel);
                      return (
                        <tr
                          key={product.id}
                          className="hover:bg-secondary/5 transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-surface-container-high rounded-lg overflow-hidden shrink-0"></div>
                              <span className="font-semibold text-sm">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-[13px] leading-[18px] text-outline">
                            {product.sku}
                          </td>
                          <td className="px-6 py-4 text-sm">{product.category}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-on-surface-variant">
                            {product.maxStock} units
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-secondary font-bold text-xs hover:underline decoration-2">
                              Restock
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Floating Interaction Button */}
        <button className="fixed bottom-8 right-8 w-14 h-14 bg-secondary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
          <span className="material-symbols-outlined text-[28px] group-hover:rotate-90 transition-transform">
            add
          </span>
          <div className="absolute right-16 px-4 py-2 bg-on-background text-white rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-xl">
            Quick Action Menu
          </div>
        </button>
      </main>
    </div>
  );
}
