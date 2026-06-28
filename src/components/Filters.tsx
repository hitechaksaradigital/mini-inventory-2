"use client";

interface FiltersProps {
  category: string;
  onCategoryChange: (value: string) => void;
  stockStatus: string;
  onStockStatusChange: (value: string) => void;
  categories: string[];
}

export default function Filters({
  category,
  onCategoryChange,
  stockStatus,
  onStockStatusChange,
  categories,
}: FiltersProps) {
  return (
    <div className="col-span-1 sm:col-span-2 bg-surface-container-highest/30 p-4 sm:p-6 rounded-xl border border-outline-variant techno-shadow flex flex-col justify-center">
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
        <div className="flex-1 min-w-0 sm:min-w-[180px]">
          <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">
            Category
          </label>
          <select
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg text-[14px] leading-[20px] py-2 px-3 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-0 sm:min-w-[180px]">
          <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">
            Stock Status
          </label>
          <select
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg text-[14px] leading-[20px] py-2 px-3 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none"
            value={stockStatus}
            onChange={(e) => onStockStatusChange(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
        <button className="sm:mt-5 p-2.5 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors self-end sm:self-auto">
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </div>
    </div>
  );
}
