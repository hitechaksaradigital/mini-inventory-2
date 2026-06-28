"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import StatsCards from "@/components/StatsCards";
import Filters from "@/components/Filters";
import ProductTable from "@/components/ProductTable";
import ProductModal from "@/components/ProductModal";
import DeleteModal from "@/components/DeleteModal";
import type { Product } from "@/db/schema";
import type { ProductFormData } from "@/components/ProductModal";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SEED_DATA = [
  { name: 'MacBook Pro M2 - 14"', sku: "ELC-MBP-14-M2", category: "Electronics", stock_level: 42, max_stock: 50, buy_price: "1850.00", sell_price: "2299.00", icon: "devices" },
  { name: "Premium Cotton T-Shirt (L)", sku: "CLO-TSH-COT-L", category: "Clothing", stock_level: 8, max_stock: 50, buy_price: "12.50", sell_price: "34.99", icon: "checkroom" },
  { name: "Organic Coffee Beans (1kg)", sku: "FOD-COF-ORG-1K", category: "Food", stock_level: 124, max_stock: 130, buy_price: "18.20", sell_price: "42.00", icon: "restaurant" },
  { name: "Wireless Noise Cancelling Headphones", sku: "ELC-WNC-HDP-BK", category: "Electronics", stock_level: 15, max_stock: 50, buy_price: "120.00", sell_price: "249.99", icon: "headphones" },
  { name: "Ergonomic Office Chair", sku: "FUR-ERG-CHR-01", category: "Furniture", stock_level: 33, max_stock: 40, buy_price: "280.00", sell_price: "549.00", icon: "chair" },
  { name: "Smart Watch Pro Series", sku: "ELC-SWP-GLD-42", category: "Electronics", stock_level: 5, max_stock: 30, buy_price: "180.00", sell_price: "399.99", icon: "watch" },
  { name: "Italian Leather Belt (M)", sku: "CLO-BLT-LTH-M", category: "Clothing", stock_level: 67, max_stock: 80, buy_price: "22.00", sell_price: "64.99", icon: "checkroom" },
  { name: "Extra Virgin Olive Oil (500ml)", sku: "FOD-OIL-EVO-5H", category: "Food", stock_level: 200, max_stock: 250, buy_price: "8.50", sell_price: "19.99", icon: "restaurant" },
  { name: "4K Ultra HD Monitor - 27\"", sku: "ELC-MON-4K-27", category: "Electronics", stock_level: 0, max_stock: 25, buy_price: "350.00", sell_price: "599.99", icon: "monitor" },
  { name: "Running Shoes Pro (Size 10)", sku: "CLO-SHO-RUN-10", category: "Clothing", stock_level: 45, max_stock: 60, buy_price: "65.00", sell_price: "139.99", icon: "checkroom" },
  { name: "Standing Desk Converter", sku: "FUR-DSK-STD-01", category: "Furniture", stock_level: 12, max_stock: 20, buy_price: "150.00", sell_price: "299.00", icon: "desk" },
  { name: "Bluetooth Speaker Portable", sku: "ELC-SPK-BT-RD", category: "Electronics", stock_level: 78, max_stock: 100, buy_price: "25.00", sell_price: "59.99", icon: "speaker" },
  { name: "Organic Green Tea (100 bags)", sku: "FOD-TEA-GRN-1H", category: "Food", stock_level: 3, max_stock: 50, buy_price: "6.00", sell_price: "14.99", icon: "restaurant" },
  { name: "Winter Parka Jacket (XL)", sku: "CLO-JKT-PRK-XL", category: "Clothing", stock_level: 18, max_stock: 30, buy_price: "85.00", sell_price: "199.99", icon: "checkroom" },
  { name: "USB-C Docking Station", sku: "ELC-DCK-USC-01", category: "Electronics", stock_level: 55, max_stock: 70, buy_price: "45.00", sell_price: "89.99", icon: "dock" },
  { name: "Bamboo Cutting Board Set", sku: "FUR-KIT-BCB-ST", category: "Furniture", stock_level: 90, max_stock: 100, buy_price: "12.00", sell_price: "29.99", icon: "kitchen" },
  { name: "Wireless Gaming Mouse", sku: "ELC-MOU-WGM-BK", category: "Electronics", stock_level: 2, max_stock: 40, buy_price: "35.00", sell_price: "79.99", icon: "mouse" },
  { name: "Dark Chocolate Bar (200g)", sku: "FOD-CHO-DRK-2H", category: "Food", stock_level: 150, max_stock: 200, buy_price: "3.50", sell_price: "8.99", icon: "restaurant" },
  { name: "Cashmere Scarf (Unisex)", sku: "CLO-SCR-CSH-UN", category: "Clothing", stock_level: 22, max_stock: 35, buy_price: "40.00", sell_price: "99.99", icon: "checkroom" },
  { name: "Mechanical Keyboard RGB", sku: "ELC-KBD-MEC-RG", category: "Electronics", stock_level: 31, max_stock: 50, buy_price: "55.00", sell_price: "129.99", icon: "keyboard" },
  { name: "Protein Powder Vanilla (2kg)", sku: "FOD-PRO-VAN-2K", category: "Food", stock_level: 7, max_stock: 40, buy_price: "25.00", sell_price: "54.99", icon: "restaurant" },
  { name: "Bookshelf 5-Tier Walnut", sku: "FUR-BSH-WLN-05", category: "Furniture", stock_level: 9, max_stock: 15, buy_price: "120.00", sell_price: "249.00", icon: "shelves" },
  { name: "Webcam 1080p HD", sku: "ELC-WEB-1080-HD", category: "Electronics", stock_level: 40, max_stock: 60, buy_price: "30.00", sell_price: "69.99", icon: "videocam" },
  { name: "Denim Jeans Slim Fit (32)", sku: "CLO-JNS-SLM-32", category: "Clothing", stock_level: 56, max_stock: 80, buy_price: "28.00", sell_price: "69.99", icon: "checkroom" },
  { name: "Almond Butter Organic (500g)", sku: "FOD-BUT-ALM-5H", category: "Food", stock_level: 0, max_stock: 60, buy_price: "7.00", sell_price: "16.99", icon: "restaurant" },
];

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

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from("products").select("*", { count: "exact" });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,sku.ilike.%${searchQuery}%`);
      }

      if (category) {
        query = query.eq("category", category);
      }

      if (stockStatus === "out_of_stock") {
        query = query.eq("stock_level", 0);
      } else if (stockStatus === "low_stock") {
        query = query.gt("stock_level", 0).lt("stock_level", "max_stock * 0.2" as any);
      } else if (stockStatus === "in_stock") {
        query = query.gt("stock_level", "max_stock * 0.2" as any);
      }

      const { data: productsData, error, count } = await query
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;

      const { data: categoriesData } = await supabase
        .from("products")
        .select("category")
        .order("category");

      const uniqueCategories = [...new Set(categoriesData?.map((c: { category: string }) => c.category) || [])];

      const products = productsData?.map((p) => ({
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
      })) || [];

      const totalProducts = count || 0;

      const { count: inStockCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .gt("stock_level", 0);

      const { count: lowStockCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .gt("stock_level", 0)
        .lt("stock_level", 20);

      setData({
        products,
        totalCount: totalProducts,
        stats: {
          total: inStockCount || 0,
          lowStock: lowStockCount || 0,
        },
        categories: uniqueCategories,
      });
    } catch (err: unknown) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, category, stockStatus]);

  useEffect(() => {
    async function seedIfEmpty() {
      try {
        const { count } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        if (!count || count === 0) {
          await supabase.from("products").insert(SEED_DATA);
        }
      } catch (err) {
        console.error("Seed error:", err);
      }
    }
    seedIfEmpty();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, category, stockStatus]);

  async function handleSave(formData: ProductFormData) {
    setSaving(true);
    try {
      const productData = {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        stock_level: formData.stockLevel || 0,
        max_stock: formData.maxStock || 100,
        buy_price: formData.buyPrice,
        sell_price: formData.sellPrice,
        icon: formData.icon || "inventory_2",
        description: formData.description || null,
      };

      let result;
      if (editingProduct) {
        result = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();
      }

      if (result.error) {
        if (result.error.code === "23505") {
          alert("A product with this SKU already exists");
        } else {
          alert(result.error.message || "Failed to save product");
        }
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
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", deletingId);

      if (error) throw error;

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

      <main className="flex-1 lg:ml-sidebar-width min-h-screen flex flex-col w-full">
        <TopNav
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <div className="p-4 sm:p-gutter flex-1 max-w-[1440px] mx-auto w-full">
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