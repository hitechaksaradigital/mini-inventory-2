"use client";

export default function TopNav({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <header className="flex justify-between items-center w-full px-gutter h-16 bg-surface border-b border-outline-variant sticky top-0 z-40">
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-[14px] leading-[20px] focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
            placeholder="Search products, SKUs, or batches..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-4">
          <button className="text-on-surface-variant hover:text-secondary-container transition-all relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          <button className="text-on-surface-variant hover:text-secondary-container transition-all">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>

        <div className="flex items-center gap-3 border-l border-outline-variant pl-6">
          <div className="text-right">
            <p className="text-[14px] leading-[20px] font-bold leading-tight">
              Alex Rivera
            </p>
            <p className="text-[10px] text-on-surface-variant font-medium">
              Warehouse Manager
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center overflow-hidden border border-outline-variant">
            <span className="material-symbols-outlined text-secondary">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
