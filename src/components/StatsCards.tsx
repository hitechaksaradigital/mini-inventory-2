"use client";

interface StatsCardsProps {
  totalProducts: number;
  lowStockCount: number;
}

export default function StatsCards({
  totalProducts,
  lowStockCount,
}: StatsCardsProps) {
  return (
    <>
      <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-xl border border-outline-variant techno-shadow">
        <p className="text-[11px] sm:text-[12px] leading-[16px] tracking-[0.05em] font-bold text-on-surface-variant mb-1 sm:mb-2 uppercase">
          Total Products
        </p>
        <h3 className="text-[24px] sm:text-[30px] leading-[32px] sm:leading-[38px] font-bold tracking-tight">
          {totalProducts.toLocaleString()}
        </h3>
        <div className="mt-1.5 sm:mt-2 flex items-center text-tertiary-container font-medium text-xs">
          <span className="material-symbols-outlined text-xs mr-1">
            trending_up
          </span>{" "}
          +12% from last month
        </div>
      </div>

      <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-xl border border-outline-variant techno-shadow">
        <p className="text-[11px] sm:text-[12px] leading-[16px] tracking-[0.05em] font-bold text-on-surface-variant mb-1 sm:mb-2 uppercase">
          Low Stock Alerts
        </p>
        <h3 className="text-[24px] sm:text-[30px] leading-[32px] sm:leading-[38px] font-bold tracking-tight text-error">
          {lowStockCount}
        </h3>
        <div className="mt-1.5 sm:mt-2 flex items-center text-error font-medium text-xs">
          <span className="material-symbols-outlined text-xs mr-1">
            warning
          </span>{" "}
          Action required
        </div>
      </div>
    </>
  );
}
