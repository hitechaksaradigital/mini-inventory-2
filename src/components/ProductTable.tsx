"use client";

import type { Product } from "@/db/schema";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  page: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

function getStockStatus(level: number, max: number) {
  const pct = max > 0 ? (level / max) * 100 : 0;
  if (level === 0)
    return {
      label: "Out of Stock",
      color: "bg-on-surface-variant",
      textColor: "text-on-surface-variant",
    };
  if (pct <= 20)
    return { label: "Low Stock", color: "bg-error", textColor: "text-error" };
  return {
    label: "In Stock",
    color: "bg-tertiary-fixed-dim",
    textColor: "text-on-tertiary-container",
  };
}

function getCategoryStyle(category: string) {
  switch (category.toLowerCase()) {
    case "electronics":
      return "bg-primary-fixed text-on-primary-fixed-variant";
    case "clothing":
      return "bg-secondary-fixed text-on-secondary-fixed-variant";
    case "food":
      return "bg-tertiary-fixed text-on-tertiary-fixed-variant";
    default:
      return "bg-surface-container-high text-on-surface-variant";
  }
}

function getCategoryIcon(category: string) {
  switch (category.toLowerCase()) {
    case "electronics":
      return "devices";
    case "clothing":
      return "checkroom";
    case "food":
      return "restaurant";
    default:
      return "inventory_2";
  }
}

function formatPrice(price: string | number) {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `$${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  page,
  totalCount,
  pageSize,
  onPageChange,
}: ProductTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  function renderPagination() {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant techno-shadow overflow-hidden">
      {/* ===== DESKTOP TABLE (hidden on mobile) ===== */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low/50">
              <th className="px-6 py-4 text-[12px] leading-[16px] tracking-[0.05em] font-bold text-on-surface-variant uppercase">
                Product Name
              </th>
              <th className="px-6 py-4 text-[12px] leading-[16px] tracking-[0.05em] font-bold text-on-surface-variant uppercase">
                SKU
              </th>
              <th className="px-6 py-4 text-[12px] leading-[16px] tracking-[0.05em] font-bold text-on-surface-variant uppercase">
                Category
              </th>
              <th className="px-6 py-4 text-[12px] leading-[16px] tracking-[0.05em] font-bold text-on-surface-variant uppercase text-center">
                Stock Level
              </th>
              <th className="px-6 py-4 text-[12px] leading-[16px] tracking-[0.05em] font-bold text-on-surface-variant uppercase">
                Buy Price
              </th>
              <th className="px-6 py-4 text-[12px] leading-[16px] tracking-[0.05em] font-bold text-on-surface-variant uppercase">
                Sell Price
              </th>
              <th className="px-6 py-4 text-[12px] leading-[16px] tracking-[0.05em] font-bold text-on-surface-variant uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-on-surface-variant"
                >
                  No products found.
                </td>
              </tr>
            )}
            {products.map((product) => {
              const status = getStockStatus(
                product.stockLevel,
                product.maxStock
              );
              const pct =
                product.maxStock > 0
                  ? Math.min(
                      100,
                      (product.stockLevel / product.maxStock) * 100
                    )
                  : 0;
              return (
                <tr
                  key={product.id}
                  className="hover:bg-surface-container transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-surface-container-high flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-outline">
                          {getCategoryIcon(product.category)}
                        </span>
                      </div>
                      <span className="text-[16px] leading-[24px] font-bold">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[13px] leading-[18px] font-medium text-on-surface-variant">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`${getCategoryStyle(product.category)} px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider`}
                    >
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-mono text-[13px] leading-[18px] font-medium">
                        {product.stockLevel} units
                      </span>
                      <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div
                          className={`${status.color} h-full transition-all`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <span
                        className={`text-[10px] ${status.textColor} font-bold uppercase`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[13px] leading-[18px] font-medium">
                    {formatPrice(product.buyPrice)}
                  </td>
                  <td className="px-6 py-4 font-mono text-[13px] leading-[18px] font-bold text-secondary">
                    {formatPrice(product.sellPrice)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1.5 rounded hover:bg-secondary-fixed text-secondary transition-colors"
                        title="Edit"
                        onClick={() => onEdit(product)}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          edit_square
                        </span>
                      </button>
                      <button
                        className="p-1.5 rounded hover:bg-error-container text-error transition-colors"
                        title="Delete"
                        onClick={() => onDelete(product.id)}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ===== MOBILE CARD VIEW (hidden on desktop) ===== */}
      <div className="lg:hidden divide-y divide-outline-variant">
        {products.length === 0 && (
          <div className="px-4 py-12 text-center text-on-surface-variant">
            No products found.
          </div>
        )}
        {products.map((product) => {
          const status = getStockStatus(product.stockLevel, product.maxStock);
          const pct =
            product.maxStock > 0
              ? Math.min(100, (product.stockLevel / product.maxStock) * 100)
              : 0;
          return (
            <div
              key={product.id}
              className="p-4 hover:bg-surface-container transition-colors"
            >
              {/* Top row: icon, name, actions */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded bg-surface-container-high flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-outline">
                    {getCategoryIcon(product.category)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] leading-[22px] font-bold truncate">
                    {product.name}
                  </p>
                  <p className="font-mono text-[12px] leading-[16px] text-on-surface-variant mt-0.5">
                    {product.sku}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    className="p-1.5 rounded hover:bg-secondary-fixed text-secondary transition-colors"
                    title="Edit"
                    onClick={() => onEdit(product)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      edit_square
                    </span>
                  </button>
                  <button
                    className="p-1.5 rounded hover:bg-error-container text-error transition-colors"
                    title="Delete"
                    onClick={() => onDelete(product.id)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>

              {/* Middle row: category badge + stock */}
              <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                <span
                  className={`${getCategoryStyle(product.category)} px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider`}
                >
                  {product.category}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div
                      className={`${status.color} h-full transition-all`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <span className="font-mono text-[12px] font-medium">
                    {product.stockLevel}
                  </span>
                  <span
                    className={`text-[10px] ${status.textColor} font-bold uppercase`}
                  >
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Bottom row: prices */}
              <div className="mt-3 flex items-center gap-4 text-[13px]">
                <div>
                  <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">
                    Buy{" "}
                  </span>
                  <span className="font-mono font-medium">
                    {formatPrice(product.buyPrice)}
                  </span>
                </div>
                <div>
                  <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">
                    Sell{" "}
                  </span>
                  <span className="font-mono font-bold text-secondary">
                    {formatPrice(product.sellPrice)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== PAGINATION ===== */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-container-low border-t border-outline-variant">
        <p className="text-[13px] sm:text-[14px] leading-[20px] text-on-surface-variant">
          Showing {totalCount > 0 ? startItem : 0} – {endItem} of{" "}
          {totalCount.toLocaleString()}
        </p>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            className="p-1.5 sm:p-2 rounded border border-outline-variant hover:bg-surface disabled:opacity-30"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <span className="material-symbols-outlined text-sm">
              chevron_left
            </span>
          </button>
          {renderPagination().map((p, i) =>
            typeof p === "string" ? (
              <span
                key={`dots-${i}`}
                className="text-on-surface-variant px-0.5 sm:px-1 text-xs"
              >
                ...
              </span>
            ) : (
              <button
                key={p}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded font-bold text-xs ${
                  p === page
                    ? "bg-secondary text-white"
                    : "border border-outline-variant hover:bg-surface text-on-surface-variant"
                }`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            )
          )}
          <button
            className="p-1.5 sm:p-2 rounded border border-outline-variant hover:bg-surface disabled:opacity-30"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
