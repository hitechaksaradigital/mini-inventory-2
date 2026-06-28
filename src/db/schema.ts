export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  stock_level: number;
  max_stock: number;
  buy_price: string;
  sell_price: string;
  icon: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export type NewProduct = Omit<Product, "id" | "created_at" | "updated_at">;