export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  stockLevel: number;
  maxStock: number;
  buyPrice: string;
  sellPrice: string;
  icon: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export type NewProduct = Omit<Product, "id" | "createdAt" | "updatedAt">;