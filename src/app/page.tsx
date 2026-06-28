"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import StatsCards from "@/components/StatsCards";
import Filters from "@/components/Filters";
import ProductTable from "@/components/ProductTable";
import ProductModal from "@/components/ProductModal";
import DeleteModal from "@/components/DeleteModal";
import type { Product } from "@/db/schema";
import type { ProductFormData } from "@/components/ProductModal";

interface ApiResponse {
  products: Product[];
  totalCount: number;
  stats: { total: number; lowStock: number };
  categories: string[];
}

export default function HomePage() {
  const [data, setData] = useState<ApiResponse>({
    products: [],
    totalCount: 0,
    stats: { total: 0, lowStock: 0 },
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Sidebar mobile state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [seeded, setSeeded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Seed database on first load
  useEffect(() => {
    async function seed() {
      try {
        await fetch("/api/seed", { method: "POST" });
        setSeeded(true);
      } catch {
        setSeeded(true);
      }
    }
    seed();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        search: searchQuery,
        category,
        stockStatus,
      });
      const res = await fetch(`/api/products?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json: ApiResponse = await res.json();
      setData(json);
    } catch {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, category, stockStatus]);

  useEffect(() => {
    if (seeded) fetchProducts();
  }, [seeded, fetchProducts]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, category, stockStatus]);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (seeded) {
      setPage(1);
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  async function handleSave(formData: ProductFormData) {
    setSaving(true);
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to save product");
        return;
      }

      setShowProductModal(false);
      setEditingProduct(null);
      fetchProducts();
    } catch {
      alert("Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setShowProductModal(true);
  }

  function handleDeleteClick(id: number) {
    setDeletingId(id);
    setShowDeleteModal(true);
  }

  async function handleDeleteConfirm() {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${deletingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      setShowDeleteModal(false);
      setDeletingId(null);
      fetchProducts();
    } catch {
      alert("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content: no margin on mobile, sidebar margin on lg+ */}
      <main className="flex-1 lg:ml-sidebar-width min-h-screen flex flex-col w-full">
        <TopNav
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <div className="p-4 sm:p-gutter flex-1 max-w-[1440px] mx-auto w-full">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-[24px] sm:text-[30px] leading-[32px] sm:leading-[38px] font-semibold tracking-tight text-primary">
                Product Inventory
              </h2>
              <p className="text-on-surface-variant text-[13px] sm:text-[14px] leading-[20px]">
                Manage, track, and update your product stock in real-time.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowProductModal(true);
              }}
              className="px-4 sm:px-6 py-2.5 bg-secondary text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 techno-shadow hover:bg-secondary-container transition-all active:scale-95 w-full sm:w-auto shrink-0"
            >
              <span className="material-symbols-outlined">add_box</span>
              Add Product
            </button>
          </div>

          {/* Dashboard Stats & Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-gutter mb-6 sm:mb-8">
            <StatsCards
              totalProducts={data.stats.total}
              lowStockCount={data.stats.lowStock}
            />
            <Filters
              category={category}
              onCategoryChange={setCategory}
              stockStatus={stockStatus}
              onStockStatusChange={setStockStatus}
              categories={data.categories}
            />
          </div>

          {/* Error state */}
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-error-container text-on-error-container rounded-xl border border-error/20 flex items-center gap-3">
              <span className="material-symbols-outlined shrink-0">error</span>
              <span className="text-[13px] sm:text-[14px] flex-1">
                {error}
              </span>
              <button
                onClick={fetchProducts}
                className="text-sm font-bold underline shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && !data.products.length ? (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant techno-shadow overflow-hidden">
              <div className="p-12 flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined animate-spin text-secondary text-[32px]">
                  progress_activity
                </span>
                <p className="text-on-surface-variant text-[14px]">
                  Loading products...
                </p>
              </div>
            </div>
          ) : (
            <ProductTable
              products={data.products}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              page={page}
              totalCount={data.totalCount}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="p-4 sm:p-gutter mt-auto flex flex-col sm:flex-row justify-between items-center gap-2 bg-surface border-t border-outline-variant">
          <div className="flex items-center gap-2 text-on-surface-variant text-[10px] sm:text-[11px] font-medium uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse shrink-0"></span>
            <span>System Operational: All nodes synced</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-on-surface-variant font-medium">
            StockFlow Enterprise Pro v4.2.0 • © 2024
          </p>
        </footer>
      </main>

      {/* Modals */}
      <ProductModal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        product={editingProduct}
        saving={saving}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingId(null);
        }}
        onConfirm={handleDeleteConfirm}
        deleting={deleting}
      />
    </div>
  );
}
