"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/db/schema";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => void;
  product: Product | null;
  saving: boolean;
}

export interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  stockLevel: number;
  maxStock: number;
  buyPrice: string;
  sellPrice: string;
  icon: string;
  description: string;
}

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Food",
  "Furniture",
  "Tools",
  "Other",
];

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
  saving,
}: ProductModalProps) {
  const [form, setForm] = useState<ProductFormData>({
    name: "",
    sku: "",
    category: "Electronics",
    stockLevel: 0,
    maxStock: 100,
    buyPrice: "0.00",
    sellPrice: "0.00",
    icon: "inventory_2",
    description: "",
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        sku: product.sku,
        category: product.category,
        stockLevel: product.stockLevel,
        maxStock: product.maxStock,
        buyPrice: product.buyPrice,
        sellPrice: product.sellPrice,
        icon: product.icon,
        description: product.description || "",
      });
    } else {
      setForm({
        name: "",
        sku: "",
        category: "Electronics",
        stockLevel: 0,
        maxStock: 100,
        buyPrice: "0.00",
        sellPrice: "0.00",
        icon: "inventory_2",
        description: "",
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-surface-container-lowest rounded-t-xl sm:rounded-xl techno-shadow w-full sm:max-w-lg max-h-[92vh] sm:max-h-[90vh] overflow-y-auto animate-slide-in">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-outline-variant sticky top-0 bg-surface-container-lowest z-10">
          <h3 className="text-[18px] sm:text-[20px] leading-[28px] font-bold">
            {product ? "Edit Product" : "Add Product"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">
              Product Name *
            </label>
            <input
              type="text"
              required
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg text-[14px] leading-[20px] py-2 px-3 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">
                SKU *
              </label>
              <input
                type="text"
                required
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg text-[14px] leading-[20px] py-2 px-3 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none font-mono"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">
                Category *
              </label>
              <select
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg text-[14px] leading-[20px] py-2 px-3 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">
                Stock Level
              </label>
              <input
                type="number"
                min={0}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg text-[14px] leading-[20px] py-2 px-3 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none"
                value={form.stockLevel}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stockLevel: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">
                Max Stock
              </label>
              <input
                type="number"
                min={1}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg text-[14px] leading-[20px] py-2 px-3 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none"
                value={form.maxStock}
                onChange={(e) =>
                  setForm({
                    ...form,
                    maxStock: parseInt(e.target.value) || 100,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">
                Buy Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg text-[14px] leading-[20px] py-2 px-3 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none"
                value={form.buyPrice}
                onChange={(e) =>
                  setForm({ ...form, buyPrice: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">
                Sell Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg text-[14px] leading-[20px] py-2 px-3 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none"
                value={form.sellPrice}
                onChange={(e) =>
                  setForm({ ...form, sellPrice: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg text-[14px] leading-[20px] py-2 px-3 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none resize-none"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-bold text-sm hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-secondary text-white font-bold text-sm rounded-lg hover:bg-secondary-container transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && (
                <span className="material-symbols-outlined animate-spin text-sm">
                  progress_activity
                </span>
              )}
              {product ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
